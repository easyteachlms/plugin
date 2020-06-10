<?php

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
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_course_structure_restfully' ),
				'args'                => array(
					'course_id' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
				),
				'permission_callback' => function () {
					// @@TODO also a user auth system that will double check that the user has purchased access OR is an admin
					return current_user_can( 'read' );
				},
			)
		);
	}

	public function get_course_structure_restfully( \WP_REST_Request $request ) {
		$post_id = $request->get_param( 'course_id' );
		return $this->get_course_structure( $post_id );
	}

	protected function get_course_structure( int $post_id ) {
		$post = get_post( $post_id );
		if ( false === $post ) {
			return false;
		}

		$parsed = parse_blocks( $post->post_content );
		if ( empty( $pasred ) ) {
			return false;
			// Throw error or notice
		}
		$structure = array();
		$strucure  = array(
			'title'    => $post->post_title,
			'lessons'  => 'lesson count here as integer',
			'topics'   => 'topics count here as integer',
			'enrolled' => 'the total number of students currently enrolled in this course?', // get_post_meta( $post_id, '_enrolled', true );
			'points'   => 'should we have a numerical points value for the course on "completion" for a student???',
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
		return $structure;
	}

	public function update_course_structure( int $post_id ) {

	}

	public function diff_course_structure( int $post_id ) {

	}
}

new Data_Model( true );
