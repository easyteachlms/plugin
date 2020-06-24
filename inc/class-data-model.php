<?php
namespace EasyTeachLMS;

use WP_REST_Request;
/**
 * Course structure should be added as post meta to the course.
 * Whenever a topic is added to a lesson the topic should have post meta that should list the post id's of the lessons where it can be found.
 * Whenever a lesson is added to a course the lesson should have post meta that lists the ids of the courses where it can be found.
 */
class Data_Model {
	public function __construct( $init = false ) {
		add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
	}

	public function register_rest_endpoint() {
		register_rest_route(
			'easyteachlms/v3',
			'/course/get',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'get_course_structure_restfully' ),
				'args'     => array(
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
				),
			// 'permission_callback' => function () {
			// @@TODO also a user auth system that will double check that the user has purchased access OR is an admin
			// return current_user_can( 'read' );
			// },
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

	public function get_course_structure_restfully( \WP_REST_Request $request ) {
		$post_id = $request->get_param( 'courseId' );
		return $this->get_course_structure( $post_id );
	}

	/**
	 * @TODO Look into caching this for a 7 * DAYS_IN_HOURS, on post update we should bust the cache here
	 * @param int $post_id
	 * @return false|array
	 */
	protected function get_course_structure( int $post_id ) {
		$post = get_post( $post_id );
		if ( false === $post ) {
			return false;
		}

		$parsed = parse_blocks( $post->post_content );

		if ( empty( $parsed ) ) {
			return false;
		}

		$outline = $this->parse_outline( $parsed, $post_id );
		$quizzes = $this->recursively_search_for_blocks( $parsed, 'blockName', 'easyteachlms/quiz' );
		$quizzes = $this->parse_quizzes( $quizzes );

		$structure = array(
			'id'       => $post->ID,
			'title'    => $post->post_title,
			'lessons'  => 'lesson count here as integer',
			'topics'   => 'topics count here as integer',
			'enrolled' => get_post_meta( $post_id, '_enrolled_users', true ),
			'points'   => 'should we have a numerical points value for the course on "completion" for a student???',
			'quizzes'  => $quizzes,
			'outline'  => $outline,
		);

		return apply_filters( 'easyteachlms_course_structure', $structure, $post_id );
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

	/**
	 * Parses internal block structure and extracts common elements like title and ID
	 *
	 * @param mixed $block_name
	 * @param mixed $block
	 * @param mixed $key
	 * @param mixed $outline
	 * @return void
	 */
	protected function parse( $block_name, $block ) {
		if ( true !== $this->is_block( $block_name, $block ) ) {
			return;
		}
		if ( is_array( $block_name ) ) {
			$block_name = $block_name[ array_search( $block['blockName'], $block_name ) ];
		}
		return array(
			'parentTitle' => false,
			'title'       => $block['attrs']['title'],
			'attachedId'  => $block['attrs']['id'],
			'uuid'        => $block['attrs']['uuid'],
			'type'        => $this->get_block_name( ( $block['blockName'] ) ),
			'hasQuiz'     => false,
			'active'      => false,
			'completed'   => false,
		);
	}

	protected function parse_outline( $blocks ) {
		$course = $this->recursively_search_for_blocks( $blocks, 'blockName', 'easyteachlms/course' );
		$course = array_pop( $course );
		// error_log( 'parse_outline' );
		// error_log( print_r( $course, true ) );

		if ( true !== $this->has_innerBlocks( $course ) ) {
			return false;
		}

		$outline = array(
			'structured' => array(),
			'flat'       => array(),
		);
		foreach ( $course['innerBlocks'] as $key => $lesson ) {
			$lesson_uuid                           = $lesson['attrs']['uuid'];
			$lesson_title                          = $lesson['attrs']['title'];
			$lesson_parsed                         = $this->parse( 'easyteachlms/lesson', $lesson );
			$outline['structured'][ $lesson_uuid ] = $lesson_parsed;
			$outline['flat'][]                     = $lesson_parsed;

			if ( true === $this->has_innerBlocks( $lesson ) ) {
				foreach ( $lesson['innerBlocks'] as $key => $block ) {
					$uuid                        = $block['attrs']['uuid'];
					$block_parsed                = $this->parse( 'easyteachlms/topic', $block );
					$block_parsed['parentTitle'] = $lesson_title;
					// Detect if there is a quiz and maybe add an
					if ( true === $this->has_innerBlocks( $block ) ) {
						foreach ( $block['innerBlocks'] as $key => $block ) {
							if ( 'easyteachlms/quiz' === $block['blockName'] ) {
								$block_parsed['hasQuiz'] = true;
							}
						}
					}
					$outline['flat'][] = $block_parsed;
					$outline['structured'][ $lesson_uuid ]['outline'][ $uuid ] = $block_parsed;
				}
			}
		}
		return $outline;
	}

	protected function parse_quizzes( $quizzes ) {
		$return = array();
		foreach ( $quizzes as $quiz ) {

			$uuid            = $quiz['attrs']['uuid'];
			$return[ $uuid ] = array(
				'quizTitle'    => 'Quiz Title Here...',
				'quizSynopsis' => 'Quiz Synopsis Here...',
				'questions'    => array(),
			);

			$questions = $quiz['innerBlocks'];
			foreach ( $questions as $question ) {
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
				$return[ $uuid ]['questions'][] = array(
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
		}
		return $return;
	}

	public function update_course_structure( int $post_id ) {

	}

	public function diff_course_structure( int $post_id ) {

	}
}

new Data_Model( true );
