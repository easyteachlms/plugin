<?php
namespace EasyTeachLMS;

use WP_REST_Request;
use WP_Error;
/**
 * Course structure should be added as post meta to the course.
 * Whenever a lesson is added to a course the lesson should have post meta that lists the ids of the courses where it can be found.
 */
class Data_Model {
	protected $course_id = false;
	protected $user_id   = false;
	protected $site_id   = false;

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
		}
	}

	public function register_rest_endpoint() {
		register_rest_route(
			'easyteachlms/v3',
			'/course/get',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_course_structure_restfully' ),
				'args'                => array(
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'userId'   => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
				),
				'permission_callback' => function () {
					// return current_user_can( 'read' );
					return true;
				},
			)
		);
	}

	public function recursively_search_for_blocks( $array, $key, $value ) {
		$results = array();

		if ( is_array( $array ) ) {

			if ( isset( $array[ $key ] ) && $array[ $key ] == $value ) {
				$results[] = $array;
			}

			foreach ( $array as $subarray ) {
				$results = array_merge( $results, $this->recursively_search_for_blocks( $subarray, $key, $value ) );
			}
		}

		return $results;
	}

	public function has_innerBlocks( $block ) {
		if ( array_key_exists( 'innerBlocks', $block ) ) {
			return true;
		} else {
			return false;
		}
	}

	public function get_block_name( $block_name ) {
		return str_replace( 'easyteachlms/', '', $block_name );
	}

	/**
	 * Sanity check, is the block given the block expected?
	 *
	 * @param mixed $block_name
	 * @param mixed $block
	 * @return bool
	 */
	public function is_block( $block_name, $block ) {
		if ( is_array( $block_name ) ) {
			if ( in_array( $block['blockName'], $block_name, true ) ) {
				return true;
			} else {
				return false;
			}
		} else {
			if ( $block_name === $block['blockName'] ) {
				return true;
			} else {
				return false;
			}
		}
	}

	public function is_complete( $uuid, $course_id, $user_id, $site_id ) {
		if ( function_exists( 'switch_to_blog' ) ) {
			switch_to_blog( $site_id );
		}
		$meta_key      = "_course_{$course_id}_{$site_id}";
		$user_progress = get_user_meta( $user_id, $meta_key, true );
		if ( function_exists( 'restore_current_blog' ) ) {
			restore_current_blog();
		}
		if ( is_array( $user_progress ) && array_key_exists( 'completed', $user_progress ) && in_array( $uuid, $user_progress['completed'] ) ) {
			return true;
		} else {
			return false;
		}
	}

	public function get_course_structure_restfully( \WP_REST_Request $request ) {
		return $this->get_course_structure(
			$request->get_param( 'courseId' ),
			$request->get_param( 'userId' ),
			get_current_blog_id()
		);
	}

	/**
	 * @TODO Look into caching this for a 7 * DAYS_IN_HOURS, on post update we should bust the cache here
	 * @param int $post_id
	 * @return false|array
	 */
	public function get_course_structure( int $course_id = 0, $user_id = false, $site_id = false ) {
		error_log( "get_course_structure({$course_id})" );
		$post = get_post( $course_id );
		if ( false === $post || null === $post || \is_wp_error( $post ) || ! is_object( $post ) || ! property_exists( $post, 'post_content' ) ) {
			return new WP_Error( 'fetch-error', __( 'API could not find course with id of ' . $course_id, 'easyteachlms' ) );
		}

		$parsed = \parse_blocks( $post->post_content );

		if ( empty( $parsed ) ) {
			return new WP_Error( 'parse-error', __( 'API could not parse course', 'easyteachlms' ) );
		}

		$course  = $this->recursively_search_for_blocks( $parsed, 'blockName', 'easyteachlms/course' );
		$course  = array_pop( $course );
		$outline = $this->parse_course( $course, $course_id, $user_id, $site_id );

		$files = $this->recursively_search_for_blocks( $parsed, 'blockName', 'core/file' );
		$files = $this->parse_files( $files );

		$structure = array(
			'id'          => $post->ID,
			'title'       => $post->post_title,
			'link'        => get_permalink( $post->ID ),
			'excerpt'     => $post->post_excerpt,
			'description' => null,
			'points'      => 'NULL', // Gather up all the quiz points as total points here??
			'outline'     => $outline,
			'files'       => $files,
			'enrolled'    => false,
		);

		if ( array_key_exists( 'description', $course['attrs'] ) ) {
			$structure['description'] = $course['attrs']['description'];
		}

		if ( empty( $structure['excerpt'] ) && ! empty( $structure['description'] ) ) {
			$structure['excerpt'] = $course['attrs']['description'];
		}

		return apply_filters( 'easyteachlms_course_structure', $structure, $course_id );
	}

	protected function parse_course( $course, $course_id, $user_id, $site_id ) {

		error_log( 'parse_course()' );

		if ( true !== $this->has_innerBlocks( $course ) ) {
			return new WP_Error( 'parse-error', __( 'API could not find any innerblocks', 'easyteachlms' ) );
		}

		$outline = array(
			'structured' => array(),
			'flat'       => array(),
			'completed'  => 0,
			'total'      => 0,
		);

		foreach ( $course['innerBlocks'] as $key => $block ) {
			if ( $this->is_block( 'easyteachlms/lesson', $block ) ) {
				$lesson_uuid                           = $block['attrs']['uuid'];
				$lesson_title                          = $block['attrs']['title'];
				$lesson_parsed                         = $this->parse( 'easyteachlms/lesson', $block, $course_id, $user_id, $site_id );
				$outline['structured'][ $lesson_uuid ] = $lesson_parsed;
				$outline['flat'][]                     = $lesson_parsed;

				$lesson_locked = $lesson_parsed['locked'];

				if ( true === $this->has_innerBlocks( $block ) ) {
					foreach ( $block['innerBlocks'] as $key => $block ) {

						$uuid = $block['attrs']['uuid'];

						if ( 'easyteachlms/quiz' === $block['blockName'] ) {
							$block_parsed = $this->parse_quiz( $block, $course_id, $user_id, $site_id );
							// If this has a quiz then we don't want to allow completion until the quiz is finished.
							error_log( 'conditionsMet?' );
							if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
								$block_parsed['conditionsMet'] = true;
							}
						} else {
							$block_parsed = $this->parse( 'easyteachlms/lesson-content', $block, $course_id, $user_id, $site_id );
						}

						$block_parsed['parentTitle'] = $lesson_title;
						$block_parsed['parentUuid']  = $lesson_uuid;
						$block_parsed['locked']      = $lesson_locked;

						// Check for completion status.
						if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
							$outline['completed'] = $outline['completed'] + 1;
						}

						$outline['flat'][] = $block_parsed;
						$outline['structured'][ $lesson_uuid ]['outline'][ $uuid ] = $block_parsed;
					}
				}
			}
		}

		return $outline;
	}

	public function narrowly_parse_course( $course_id, $user_id, $site_id ) {

		$post = \get_post( $course_id );

		if ( false === $post || null === $post || \is_wp_error( $post ) || ! is_object( $post ) || ! property_exists( $post, 'post_content' ) ) {
			return new WP_Error( 'fetch-error', __( 'API could not find course with id of ' . $course_id, 'easyteachlms' ) );
		}

		$parsed = \parse_blocks( $post->post_content );

		if ( empty( $parsed ) ) {
			return new WP_Error( 'parse-error', __( 'API could not parse course', 'easyteachlms' ) );
		}
		$course = $this->recursively_search_for_blocks( $parsed, 'blockName', 'easyteachlms/course' );
		$course = array_pop( $course );

		if ( true !== $this->has_innerBlocks( $course ) ) {
			return new WP_Error( 'parse-error', __( 'API could not find any innerBlocks', 'easyteachlms' ) );
		}

		$data = array(
			'title'    => $post->post_title,
			'progress' => array(
				'complete' => 0,
				'total'    => 0,
			),
			'data'     => array(),
			'complete' => false,
			// Not really using rawTotal at the moment but leaving it in here, this is the raw total of all lesson content blocks progress status.
			'rawTotal' => array(
				'complete' => 0,
				'total'    => 0,
			),
		);

		foreach ( $course['innerBlocks'] as $key => $block ) {
			if ( $this->is_block( 'easyteachlms/lesson', $block ) ) {
				// Add this lesson to progress total.
				$data['progress']['total'] = $data['progress']['total'] + 1;
				// Get lesson UUID for use as a key.
				$lesson_uuid = $block['attrs']['uuid'];
				// Establish lesson data blob.
				$data['data'][ $lesson_uuid ] = array(
					'title'    => $block['attrs']['title'],
					'progress' => array(
						'complete' => 0,
						'total'    => 0,
					),
					'data'     => array(),
				);
				// Parse lesson contents and narrowly extract their block data.
				if ( true !== $this->has_innerBlocks( $block ) ) {
					continue;
				}
				foreach ( $block['innerBlocks'] as $key => $block ) {
					$parsed_block = $this->narrowly_parse_block( $block['blockName'], $block, $course_id, $user_id, $site_id );
					$data['data'][ $lesson_uuid ]['data'][ $block['attrs']['uuid'] ] = $parsed_block;

					$data['data'][ $lesson_uuid ]['progress'] = $this->calculate_lesson_progress( $parsed_block, $data['data'][ $lesson_uuid ]['progress'] );
				}
				$data['rawTotal']['complete'] = $data['rawTotal']['complete'] + $data['data'][ $lesson_uuid ]['progress']['complete'];
				$data['rawTotal']['total']    = $data['rawTotal']['total'] + $data['data'][ $lesson_uuid ]['progress']['total'];

				// Mark the lesson itself as complete when the user has 100% completed all the lesson content blocks.
				if ( $data['data'][ $lesson_uuid ]['progress']['complete'] === $data['data'][ $lesson_uuid ]['progress']['total'] ) {
					$data['progress']['complete'] = $data['progress']['complete'] + 1;
				}
			}
		}

		if ( $data['progress']['complete'] === $data['progress']['total'] ) {
			$data['complete'] = true;
		}

		return $data;
	}

	public function calculate_lesson_progress( $parsed_block, $progress ) {
		$progress['total'] = $progress['total'] + 1;
		if ( true === $parsed_block['complete'] ) {
			$progress['complete'] = $progress['complete'] + 1;
		}
		return $progress;
	}

	/**
	 * Parses internal block structure and extracts only a handful of properties.
	 * Returns title, complete, type, score in a structured manner
	 *
	 * @param mixed $block_name
	 * @param mixed $block
	 * @param mixed $key
	 * @param mixed $outline
	 * @return void
	 */
	public function narrowly_parse_block( $block_name, $block, $course_id, $user_id, $site_id ) {
		if ( true !== $this->is_block( $block_name, $block ) ) {
			return;
		}

		$uuid = $block['attrs']['uuid'];

		$data = array(
			'type'     => $this->get_block_name( $block_name ),
			'title'    => $block['attrs']['title'],
			'complete' => false,
		);

		if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
			$data['complete'] = true;
		}

		if ( 'quiz' === $data['type'] ) {
			$data['score'] = $this->get_quiz_score( $block['attrs']['uuid'], $course_id, $user_id, $site_id );
		}

		return $data;
	}

	/**
	 * Parses internal block structure and extracts common elements like title and ID
	 *
	 * @param mixed $block_name
	 * @param mixed $block
	 * @param mixed $key
	 * @param mixed $outline
	 * @return void
	 */
	public function parse( $block_name, $block, $course_id, $user_id, $site_id ) {
		if ( true !== $this->is_block( $block_name, $block ) ) {
			return;
		}
		if ( is_array( $block_name ) ) {
			$block_name = $block_name[ array_search( $block['blockName'], $block_name ) ];
		}

		$uuid = $block['attrs']['uuid'];
		$data = array(
			'parentTitle'   => false,
			'parentUuid'    => false,
			'title'         => $block['attrs']['title'],
			'uuid'          => $uuid,
			'type'          => $this->get_block_name( ( $block['blockName'] ) ),
			'conditionsMet' => true,
			'active'        => false,
			'completed'     => false,
			'locked'        => false,
		);
		// Check if this block has a schedule attached, if so then check if we are after the scheduled opening date
		// if not then set the lock property to true, this will prevent users from accessing this block.
		if ( ! empty( $block['attrs']['schedule'] ) ) {
			$now = strtotime( date( 'Y-m-dH:i:s', strtotime( 'now' ) ) );
			if ( strtotime( $block['attrs']['schedule'] ) > $now ) {
				$data['locked'] = date( 'Y-m-d H:i:s', strtotime( $block['attrs']['schedule'] ) );
			}
		}

		error_log( "parse({$block['attrs']['title']})" );
		if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
			$data['completed'] = true;
		}
		return $data;
	}

	public function parse_files( $blocks ) {
		$return = array();
		foreach ( $blocks as $file ) {
			$return[] = array(
				'title' => get_the_title( $file['attrs']['id'] ),
				'href'  => $file['attrs']['href'],
			);
		}
		return $return;
	}

	public function get_quiz_score( $uuid, $course_id, $user_id, $site_id ) {
		$user_progress = get_user_meta( $user_id, "_course_{$course_id}_{$site_id}", true );
		if ( is_array( $user_progress ) && array_key_exists( 'scores', $user_progress ) && array_key_exists( $uuid, $user_progress['scores'] ) ) {
			return $user_progress['scores'][ $uuid ];
		} else {
			return false;
		}
	}

	public function parse_quiz( $quiz, $course_id, $user_id, $site_id ) {
		$return = array();
		$uuid   = $quiz['attrs']['uuid'];

		$title = $quiz['attrs']['title'];
		if ( empty( $title ) ) {
			$title = 'Quiz';
		}

		if ( ! array_key_exists( 'pointsRequiredToPass', $quiz['attrs'] ) ) {
			$points_required_to_pass = 100;
		} else {
			$points_required_to_pass = $quiz['attrs']['pointsRequiredToPass'];
		}

		$return = array(
			'parentTitle'          => false,
			'parentUuid'           => false,
			'type'                 => 'quiz',
			'title'                => $title,
			'uuid'                 => $uuid,
			'conditionsMet'        => false, // By default do not allow completion until quiz is completed
			'active'               => false,
			'completed'            => false,
			'pointsRequiredToPass' => $points_required_to_pass,
			'questions'            => array(),
			'userScore'            => false,
		);

		if ( false !== $user_score = $this->get_quiz_score( $uuid, $course_id, $user_id, $site_id ) ) {
			$return['userScore'] = $user_score;
		}

		$questions = $quiz['innerBlocks'];
		foreach ( $questions as $question ) {
			// Parse the provided question args against defaults.
			$args = wp_parse_args(
				$question['attrs'],
				array(
					'question'    => '',
					'type'        => 'text',
					'answersType' => 'single',
					'explanation' => '',
					'points'      => 10,
				)
			);

			$answers = array();
			if ( 'multiple' === $args['answersType'] ) {
				$correct_answer = array();
			} else {
				$correct_answer = false;
			}
			foreach ( $question['innerBlocks'] as $index => $answer ) {
				$answers[] = $answer['attrs']['answer'];
				if ( array_key_exists( 'isCorrect', $answer['attrs'] ) && true === $answer['attrs']['isCorrect'] ) {
					if ( 'multiple' === $args['answersType'] ) {
						$correct_answer[] = $index++;
					} else {
						$correct_answer = array( $index );
					}
				}
			}

			$args['answers']       = $answers;
			$args['correctAnswer'] = $correct_answer;

			// Construct question.
			$return['questions'][] = array(
				'question'            => $args['question'],
				'answerSelectionType' => $args['answersType'],
				'answers'             => $args['answers'],
				'correctAnswer'       => $args['correctAnswer'],
				'explanation'         => $args['explanation'],
				'points'              => $args['points'],
			);
		}
		error_log( 'parse_quiz()' );
		if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
			$return['completed'] = true;
		}

		return $return;
	}
}

new Data_Model( true );
