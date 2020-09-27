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
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_progress_restfully' ),
				'args'                => array(
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
				'permission_callback' => function () {
					return current_user_can( 'read' );
				},
			)
		);

		register_rest_route(
			'easyteachlms/v3',
			'/student/update-quiz-progress',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_quiz_progress_restfully' ),
				'args'                => array(
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
				'permission_callback' => function () {
					return current_user_can( 'read' );
				},
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
				'scores'    => array(),
			);
		}
		$data['completed'][] = $uuid;

		error_log( 'User ID' );
		error_log( $user_id );
		error_log( $meta_key );
		error_log( print_r( $data, true ) );

		// Log completion in group activity log
		if ( class_exists( 'BP_Group_Extension' ) ) {
			$attached_groups = get_post_meta( $course_id, '_attached_groups', true );
			$users_groups    = groups_get_user_groups( $user_id );
			error_log( 'users groups' );
			error_log( print_r( $attached_groups, true ) );
			error_log( print_r( $users_groups, true ) );
			if ( array_key_exists( 'groups', $users_groups ) && is_array( $users_groups['groups'] ) ) {
				foreach ( $attached_groups as $group_id ) {
					error_log( 'group: ' . $group_id );
					if ( in_array( $group_id, $users_groups ) ) {
						error_log( 'groups_record_activity' );
						$action           = sprintf( __( '%1$s completed %2$s', 'buddypress' ), bp_core_get_userlink( $user_id ), '<a href="#">' . esc_attr( get_the_title( $course_id ) ) . '</a>' );
						$content_filtered = apply_filters( 'groups_activity_new_update_content', 'Completed Title of Lesson Content UUID' );
						groups_record_activity(
							array(
								// 'id'           => false,
								'item_id'      => $group_id,
								'user_id'      => $user_id,
								'type'         => 'activity_update',
								'action'       => $action,
								'content'      => $content_filtered,
								'primary_link' => 'http://www.google.com',
							)
						);
					} else {
						error_log( 'NO GROUPS RECORD ACTIVITY' );
					}
				}
			}
		}
		$data = update_user_meta( (int) $user_id, $meta_key, $data );
		return $data;
	}

	public function update_quiz_progress_restfully( \WP_REST_Request $request ) {
		$site_id   = get_current_blog_id();
		$user_id   = (int) $request->get_param( 'userId' );
		$course_id = (int) $request->get_param( 'courseId' );
		$uuid      = $request->get_param( 'uuid' );
		$user_data = json_decode( $request->get_body(), true );

		error_log( 'update_quiz_progress_restfully!!' );
		error_log( print_r( $user_data, true ) );

		if ( ! array_key_exists( 'score', $user_data ) && ! array_key_exists( 'total', $user_data ) && ! array_key_exists( 'pointsRequiredToPass', $user_data ) ) {
			return false;
		}

		$meta_key = "_course_{$course_id}_{$site_id}";

		$data = get_user_meta( $user_id, $meta_key, true );
		if ( ! is_array( $data ) ) {
			$data = array(
				'completed' => array(),
				'scores'    => array(),
			);
		}
		$passed = $user_data['score'] >= $user_data['pointsRequiredToPass'];

		if ( true === $passed ) {
			$data['completed'][] = $uuid;
		} elseif ( array_key_exists( 'completed', $data ) && in_array( $uuid, $data['completed'] ) ) {
			// If the user has already completed/passed this quiz but then submits another entry that fails then the completion should be removed, so find the diff between an array with all the completed and one with this completed item and return that.
			$data['completed'] = array_diff( $data['completed'], array( $uuid ) );
		}
		$data['scores'][ $uuid ] = $user_data;
		error_log( 'User ID' );
		error_log( $user_id );
		error_log( $meta_key );
		error_log( print_r( $data, true ) );
		$data = update_user_meta( (int) $user_id, $meta_key, $data );
		return $data;
	}
}

new Student( true );
