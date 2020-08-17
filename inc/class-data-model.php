<?php
namespace EasyTeachLMS;

use WP_REST_Request;
/**
 * Course structure should be added as post meta to the course.
 * Whenever a topic is added to a lesson the topic should have post meta that should list the post id's of the lessons where it can be found.
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
					return current_user_can( 'read' );
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
			if ( in_array( $block['blockName'], $block_name ) ) {
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
		$user_progress = get_user_meta( $user_id, "_course_{$course_id}_{$site_id}", true );
		if ( is_array( $user_progress ) && array_key_exists( 'completed', $user_progress ) && in_array( $uuid, $user_progress['completed'] ) ) {
			return true;
		} else {
			return false;
		}
	}

	public function get_course_structure_restfully( \WP_REST_Request $request ) {
		error_log( 'get_course_structure_restfully' );
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
		error_log( "get_course_structure({$course_id}, {$user_id}, {$site_id})" );
		$post = get_post( $course_id );
		if ( false === $post ) {
			return false;
		}

		$parsed = parse_blocks( $post->post_content );

		error_log( print_r( $parsed, true ) );

		if ( empty( $parsed ) ) {
			return false;
		}

		$outline = $this->parse_course( $parsed, $course_id, $user_id, $site_id );

		$files = $this->recursively_search_for_blocks( $parsed, 'blockName', 'core/file' );
		$files = $this->parse_files( $files );

		$structure = array(
			'id'          => $post->ID,
			'title'       => $post->post_title,
			'excerpt'     => $post->post_excerpt,
			'description' => get_the_excerpt( $course_id ),
			'points'      => 'NULL', // Gather up all the quiz points as total points here??
			'outline'     => $outline,
			'files'       => $files,
			'enrolled'    => false,
		);

		error_log( print_r( $structure, true ) );

		return apply_filters( 'easyteachlms_course_structure', $structure, $course_id );
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
	protected function parse( $block_name, $block, $course_id, $user_id, $site_id ) {
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
			'attachedId'    => $block['attrs']['id'],
			'uuid'          => $uuid,
			'type'          => $this->get_block_name( ( $block['blockName'] ) ),
			'hasQuiz'       => false,
			'conditionsMet' => true,
			'active'        => false,
			'completed'     => false,
		);
		if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
			$data['completed'] = true;
		}
		return $data;
	}

	protected function parse_course( $blocks, $course_id, $user_id, $site_id ) {
		$course = $this->recursively_search_for_blocks( $blocks, 'blockName', 'easyteachlms/course' );
		error_log( 'parse_course' );
		error_log( print_r( $course, true ) );
		$course = array_pop( $course );

		if ( true !== $this->has_innerBlocks( $course ) ) {
			return false;
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

				if ( true === $this->has_innerBlocks( $block ) ) {
					foreach ( $block['innerBlocks'] as $key => $block ) {

						$uuid                        = $block['attrs']['uuid'];
						$block_parsed                = $this->parse( 'easyteachlms/topic', $block, $course_id, $user_id, $site_id );
						$block_parsed['parentTitle'] = $lesson_title;
						$block_parsed['parentUuid']  = $lesson_uuid;
						$outline['total']            = $outline['total'] + 1;
						// Check for completion status.
						if ( true === $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
							$outline['completed'] = $outline['completed'] + 1;
						}
						// Check for quiz.
						if ( true === $this->has_innerBlocks( $block ) ) {
							foreach ( $block['innerBlocks'] as $key => $block ) {
								if ( 'easyteachlms/quiz' === $block['blockName'] ) {
									$block_parsed['hasQuiz'] = true;
									$block_parsed['quiz']    = $this->parse_quiz( $block, $uuid, $course_id, $user_id, $site_id );
									// If this has a quiz then we don't want to allow completion until the quiz is finished.
									if ( true !== $this->is_complete( $uuid, $course_id, $user_id, $site_id ) ) {
										$block_parsed['conditionsMet'] = false;
									}
								}
							}
						}
						$outline['flat'][] = $block_parsed;
						$outline['structured'][ $lesson_uuid ]['outline'][ $uuid ] = $block_parsed;
					}
				}
			}
		}
		return $outline;
	}

	protected function parse_files( $blocks ) {
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

	protected function parse_quiz( $quiz, $parent_uuid = 0, $course_id, $user_id, $site_id ) {
		$return = array();
		$uuid   = $quiz['attrs']['uuid'];

		$title = $quiz['attrs']['title'];
		if ( empty( $title ) ) {
			$title = 'Quiz';
		}

		$synopsis = $quiz['attrs']['synopsis'];
		if ( empty( $synopsis ) ) {
			$synopsis = 'Quiz Synopsis Here...';
		}

		$return = array(
			'uuid'         => $uuid,
			'parent'       => $parent_uuid,
			'quizTitle'    => $title,
			'quizSynopsis' => $synopsis,
			'questions'    => array(),
			'userScore'    => false,
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
					'question'               => '',
					'type'                   => 'text',
					'answersType'            => 'single',
					'correctAnswerMessage'   => 'Good job! Correct answer.',
					'incorrectAnswerMessage' => 'Incorrect answer, try again!',
					'explanation'            => '',
					'points'                 => 10,
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
				if ( true === $answer['attrs']['isCorrect'] ) {
					if ( 'multiple' === $args['answersType'] ) {
						$correct_answer[] = $index + 1;
					} else {
						$correct_answer = $index + 1;
					}
				}
			}

			$args['answers']       = $answers;
			$args['correctAnswer'] = $correct_answer;

			// Construct question.
			$return['questions'][] = array(
				'question'                  => $args['question'],
				'questionType'              => $args['type'],
				// 'questionPic' => '', // if you need to display Picture in Question
				'answerSelectionType'       => $args['answersType'],
				'answers'                   => $args['answers'],
				'correctAnswer'             => $args['correctAnswer'],
				'messageForCorrectAnswer'   => $args['correctAnswerMessage'],
				'messageForIncorrectAnswer' => $args['incorrectAnswerMessage'],
				'explanation'               => $args['explanation'],
				'point'                     => $args['points'],
			);
		}

		return $return;
	}
}

new Data_Model( true );
