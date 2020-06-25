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
			)
		);
	}

	public function update_progress_restfully( \WP_REST_Request $request ) {
		$site_id   = get_current_blog_id();
		$user_id   = (int) $request->get_param( 'userId' );
		$course_id = (int) $request->get_param( 'courseId' );
		$uuid      = $request->get_param( 'uuid' );
		$status    = json_decode( $request->get_body(), true );

		error_log( 'update_progress_restfully' );
		error_log( print_r( $status, true ) );

		if ( ! array_key_exists( 'completed', $status ) || true !== $status['completed'] ) {
			return false;
		}

		$meta_key = "_course_{$course_id}_{$site_id}";

		$data = get_user_meta( $user_id, $meta_key, true );
		if ( ! is_array( $data ) ) {
			$data = array(
				'completed' => array(),
			);
		}
		$data['completed'][] = $uuid;
		error_log( 'User ID' );
		error_log( $user_id );
		error_log( $meta_key );
		error_log( print_r( $data, true ) );
		$data = update_user_meta( (int) $user_id, $meta_key, $data );
		return $data;
	}
}

new Student( true );
