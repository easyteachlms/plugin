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
					'course_id' => array(
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

	public function get_course_structure_restfully( WP_REST_Request $request ) {
		$post_id = $request->get_param( 'course_id' );
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

		$quizzes = $this->recursively_search_for_blocks( $parsed, 'blockName', 'easyteachlms/quiz' );
		$quizzes = $this->parse_quizzes( $quizzes );

		$structure = array(
			'title'    => $post->post_title,
			'lessons'  => 'lesson count here as integer',
			'topics'   => 'topics count here as integer',
			'enrolled' => 'the total number of students currently enrolled in this course?', // get_post_meta( $post_id, '_enrolled_users', true );
			'points'   => 'should we have a numerical points value for the course on "completion" for a student???',
			'quizzes'  => $quizzes,
			'outline'  => array(
				'lesson_01' => array(
					'topic_01',
					'topic_02',
				),
				'lesson_02' => array(
					'topic_01',
					'topic_02',
				),
			),
		);

		error_log( print_r( $structure, true ) );

		return $structure;
	}

	protected function parse_quizzes( $quizzes ) {
		$return = array();
		foreach ( $quizzes as $quiz ) {
			$title         = $quiz['attrs']['title'];
			$id            = sanitize_title( $title );
			$return[ $id ] = array(
				'quizTitle'    => $title,
				'quizSynopsis' => 'Quiz Synopsis Here...',
				'questions'    => array(),
			);

			$questions = $quiz['innerBlocks'];
			foreach ( $questions as $question ) {
				$answers        = array();
				$correct_answer = false;
				foreach ( $question['innerBlocks'] as $index => $answer ) {
					$answers[] = $answer['attrs']['answer'];
					if ( true === $answer['attrs']['isCorrect'] ) {
						$correct_answer = $index + 1;
					}
				}
				// Construct question.
				$return[ $id ]['questions'][] = array(
					'question'                  => $question['attrs']['question'],
					'questionType'              => 'text', // $question['attrs']['type'],
					// 'questionPic' => '', // if you need to display Picture in Question
					'answerSelectionType'       => 'single', // $question['attrs']['answersType'],
					'answers'                   => $answers,
					'correctAnswer'             => $correct_answer,
					'messageForCorrectAnswer'   => 'Correct answer. Good job.', // $question['attrs']['correctAnswerMessage'],
					'messageForIncorrectAnswer' => 'Incorrect answer, try again.', // $question['attrs']['incorrectAnswerMessage'],
					'explanation'               => 'Question Explanation', // $question['attrs']['explanation'],
					'point'                     => 40, // $question['attrs']['points'],
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
