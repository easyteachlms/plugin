<?php
namespace EasyTeachLMS;

use WPackio\Enqueue;
class Student {
	protected $base_permission = 'read';

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
		}
	}

	public function register_rest_endpoint() {
		register_rest_route(
			'easyteachlms/v3',
			'/student/get',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'get_student_restfully' ),
				'args'     => array(
					'userId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				// 'permission_callback' => function () {
				// return current_user_can( $this->base_permission );
				// },
			)
		);

		register_rest_route(
			'easyteachlms/v3',
			'/student/get-progress',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'get_progress_restfully' ),
				'args'     => array(
					'userId'   => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'uuid'     => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				// 'permission_callback' => function () {
				// return current_user_can( $this->base_permission );
				// },
			)
		);

		register_rest_route(
			'easyteachlms/v3',
			'/student/update-progress',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'update_progress_restfully' ),
				'args'     => array(
					'userId'   => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'uuid'     => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				// 'permission_callback' => function () {
				// return current_user_can( $this->base_permission );
				// },
			)
		);
	}

	public function default_user_state( $user_id, $user_state = array() ) {
		return wp_parse_args(
			$user_state,
			array(
				'id'      => $user_id,
				'courses' => array(),
			)
		);
	}

	/**
	 * Basic Student (User) Data Model
	 *
	 * @param WP_REST_Request $request
	 * @return void
	 */
	public function get_student_restfully( \WP_REST_Request $request ) {
		$user_id = $request->get_param( 'userId' );
		return $this->default_user_state( $user_id, get_user_meta( $user_id, '_student_data', true ) );
	}

	public function get_progress_restfully( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'userId' );
		$course_id = $request->get_param( 'courseId' );
		$uuid      = $request->get_param( 'uuid' );

		$progress = get_user_meta( $user_id, "_course_{$course_id}", true );
	}

	public function update_progress_restfully( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'userId' );
		$course_id = $request->get_param( 'courseId' );
		$uuid      = $request->get_param( 'uuid' );
		$progress  = $request->get_body();

		$data = get_user_meta( $user_id, "_course_{$course_id}", true );
		if ( ! is_array( $data ) ) {
			$data = array();
		}
		$data[ $uuid ] = $progress;

		error_log( 'update_progress_restfully' );
		error_log( print_r( $data, true ) );
	}
}

new Student( true );
