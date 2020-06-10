<?php
namespace EasyTeachLMS;

class Rest_API {
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'init' ) );
			add_action( 'rest_api_init', array( $this, 'routes' ) );
		}
	}
	public function init() {
		add_action(
			'rest_api_init',
			function() {
				$post_content_raw_schema = array(
					'description' => 'Content for the object, as it exists in the database.',
					'type'        => 'string',
					'context'     => array( 'view' ),
				);

				register_rest_field(
					'topic',
					'content_raw',
					array(
						'get_callback' => array( $this, 'show_post_content_raw' ),
						'schema'       => $post_content_raw_schema,
					)
				);
			}
		);
	}

	public function show_post_content_raw( $object, $field_name, $request ) {
		return get_post( $object['id'] )->post_content;
	}

	public function routes() {
		register_rest_route(
			'easyteachlms/v3',
			'/course/enroll',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_enroll_user_in_course' ),
				'args'                => array(
					'uid'       => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'course_id' => array(
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

		register_rest_route(
			'easyteachlms/v3',
			'/course/unenroll',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_unenroll_user_in_course' ),
				'args'                => array(
					'uid'       => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'course_id' => array(
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

	public function rest_enroll_user_in_course( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'uid' );
		$course_id = $request->get_param( 'course_id' );

		$data = get_user_meta( $user_id, '_enrolled_courses', true );
		if ( ! $data ) {
			$data = array( $course_id );
		} else {
			$data[] = $course_id;
		}

		update_user_meta( $user_id, '_enrolled_courses', $data );

		$index = get_post_meta( $course_id, '_students_enrolled', true );
		if ( ! $index ) {
			$index = array( $user_id );
		} else {
			$index[] = $user_id;
		}
		update_post_meta( $course_id, '_students_enrolled', $index );

		return $data;
	}

	public function rest_unenroll_user_in_course( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'uid' );
		$course_id = $request->get_param( 'course_id' );
		$data      = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( ! $data ) {
			return false;
		} else {
			$data = array_diff( $data, $course_id );
		}

		update_user_meta( $user_id, '_enrolled_courses', $data );

		$index = get_post_meta( $course_id, '_students_enrolled', true );
		if ( $index ) {
			$index = array_diff( $index, $user_id );
		}
		update_post_meta( $course_id, '_students_enrolled', $index );

		return $data;
	}

}
new Rest_API( true );
