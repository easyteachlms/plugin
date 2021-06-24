<?php
class Student extends EasyTeachLMS {
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
			add_action('easyteach_get_student', array($this, 'get_student'), 10, 1);
		}
	}

	public function get_student( $user_id ) {
		$user = get_user_by( 'ID', $user_id );
		if ( false === $user ) {
			return false;
		}

		$student = array(
			'displayName' => $user->display_name,
			'name'        => $user->first_name . ' ' . $user->last_name,
			'id'          => $user_id,
			'enrolled'    => get_user_meta( $user_id, '_enrolled_courses', true ),
			'data'        => array(),
		);
		
		return (object) $student;
	}

	public function register_rest_endpoints() {
		register_rest_route(
			'easyteachlms/v3',
			'/student/get', // Should this be get-progress?
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_student_restfully' ),
				'args'                => array(
					'userId' => array(
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
	}

	public function get_course( $course_id, $user_id ) {
		$data_model = new Data_Model( false );
		return $data_model->get_course_structure( $course_id, $user_id, get_current_blog_id() );
	}

	public function get_notifications( $course_data, $course_id, $user_id ) {
		// Check for anything that would signal a notification...
		// Then if that exists add a "notifications" array to the data.
		$data = false;
		// if course_data -> outline -> flat // type === quiz -> userScore -> essayAnswers not empty and if the obj therein is grade === false then add to array to return.
		foreach ( $course_data['outline']['flat'] as $key => $d ) {
			if ( 'quiz' === $d['type'] ) {
				if ( array_key_exists( 'userScore', $d ) && array_key_exists( 'essayAnswers', $d['userScore'] ) && ! empty( $d['userScore']['essayAnswers'] ) ) {
					if ( false === $data ) {
						$data = array();
					}
					$data[ $d['uuid'] ] = array(
						'data'  => $d['userScore']['essayAnswers'],
						'score' => $d['userScore']['score'],
					);
				}
			}
		}
		return $data;
	}

	public function get_student_restfully( \WP_REST_Request $request ) {
		$site_id   = get_current_blog_id();
		$user_slug = $request->get_param( 'userSlug' );
		$user      = get_user_by( 'slug', $user_slug );
		$user_id   = $user->id;

		$enrolled_courses = array_unique( get_user_meta( $user_id, '_enrolled_courses', true ) );

		$return = array(
			'userData'      => $user,
			'completed'     => array(),
			'courses'       => array(),
			'notifications' => false,
		);

		if ( $enrolled_courses ) {
			$return['enrolled'] = $enrolled_courses;
			foreach ( $enrolled_courses as $course_id ) {
				$course_data   = $this->get_course( $course_id, $user_id );
				$notifications = $this->get_notifications( $course_data, $course_id, $user_id );

				$return['courses'][] = $course_data;
				if ( false !== $notifications ) {
					$return['notifications'][ $course_id ] = $notifications;
				}
			}
		}

		return $return;

		// Get enrolled courses?
		// Get some user info like first name, last name, email
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
		$data['completed'] = array_merge( $data['completed'], array( $uuid ) );

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
					if ( in_array( $group_id, $users_groups['groups'] ) ) {
						error_log( 'groups_record_activity' );
						$action = sprintf( __( '%1$s completed %2$s', 'buddypress' ), bp_core_get_userlink( $user_id ), '<a href="#">' . esc_attr( get_the_title( $course_id ) ) . '</a>' );
						// Get course from courseId, get outline.flat[uuid].title
						$course_data  = $this->get_course( $course_id, $user_id );
						$course_title = null;
						foreach ( $course_data['outline']['flat'] as $course_elm ) {
							if ( $uuid === $course_elm['uuid'] ) {
								$course_title = $course_elm['title'];
							}
						}
						error_log( print_r( $course_title, true ) );
						$content_filtered = apply_filters( 'groups_activity_new_update_content', 'Completed ' . $course_title );
						$permalink        = get_permalink( $course_id ) . '?uuid=' . $uuid;
						groups_record_activity(
							array(
								// 'id'           => false,
								'item_id'      => $group_id,
								'user_id'      => $user_id,
								'type'         => 'activity_update',
								'action'       => $action,
								'content'      => "<a href='{$permalink}'>{$content_filtered}</a>",
								'primary_link' => $permalink,
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
}

new Student( true );