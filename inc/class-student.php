<?php
class Student extends EasyTeachLMS {
	public static $cache_bust = '100hash';
	
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'easyteach_get_student', array($this, 'get_student'), 10, 1 );
			add_action( 'easyteach_student_action', array($this, 'run_student_action'), 10, 1 );
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
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
			'easyteachlms/v4',
			'/student/get-progress', // Should this be get-progress?
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_student_restfully' ),
				'args'                => array(
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'userId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'userSlug' => array(
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
			'easyteachlms/v4',
			'/student/update-progress',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_progress_restfully' ),
				'args'                => array(),
				'permission_callback' => function () {
					return current_user_can( 'read' );
				},
			)
		);
	}

	public function get_user_meta_key($user_id, $object_id) {
		return wp_json_encode(array((int) $user_id, (int) $object_id));
	}

	/**
	 * User data is extremely important, and extremely variable. So we double and triple check values. Make sure your data is shaped correctly.
	 * 
	 */
	private function _sample() {
		// Running this action:
		do_action('easyteach_student_action', array(
			'action' => 'complete',
			'courseId' => 99999,
			'uuid' => 'ajsjf-asdfnasdf-anns',
			'userId' => 99,
			'data' => array(
				'status' => 'complete'
			)
		));
		// Would result in this data...
		$shape = array(
			'courseId' => 99999,
			'data' => array(
				'uuid' => array(
					'complete' => array(
						'timestamp1' => 'complete'
					),
				),
			),
		);
		return $shape;
	}

	public function get_user_data_by_course_id($user_id, $course_id) {
		$key = 'elms_' . md5($this->get_user_meta_key($user_id, $course_id));
		return get_user_meta($user_id, $key, true);
	}

	public function surface_only_most_recent_by_uuid($data) {
		error_log("Student Surface ". print_r($data, true));
		if ( empty($data) || !array_key_exists('data', $data) ) {
			return false;
		}
		$data = $data['data'];
		$return = array();
		foreach ($data as $uuid => $actions) {
			foreach($actions as $action => $acts) {
				$most_recent_key = array_key_last($acts);
				if ( !array_key_exists($uuid, $return) ) {
					$return[$uuid] = array();
				}
				$return[$uuid][$action] = array(
					'data' => $acts[$most_recent_key],
					'timestamp' => $most_recent_key,
				);
			}
		}
		return $return;
	}
	
	/**
	 * Rest response fetches multiple data points on user meta, returns multiple course info.
	 * @param WP_REST_Request $request 
	 * @return array 
	 */
	public function get_student_restfully( \WP_REST_Request $request ) {
		$course_id = $request->get_param( 'courseId' );
		$user_id   = $request->get_param( 'userId' );
		$user_slug = $request->get_param( 'userSlug' );
		if ( null === $user_id && null !== $user_slug ) {
			$user = get_user_by( 'slug', $user_slug );
			$user_id = $user->ID;
		} elseif ( null !== $user_id ) {
			$user = get_user_by( 'ID', $user_id );
		}

		$cache_key = md5( wp_json_encode(array($user_id, $course_id, self::$cache_bust)) );
		$cache_ttl = 30 * MINUTE_IN_SECONDS;
		$cached = get_transient( $cache_key );
		if ( false !== $cached ) {
			return $cached;
		}

		$user_data = (array) $user;
		$user_data = (array) $user->data;
		unset($user_data['user_pass']);
		unset($user_data['user_activation_key']);
		unset($user_data['user_status']);
		unset($user_data['user_url']);

		$enrolled_courses = array_unique( get_user_meta( $user_id, '_enrolled_courses', true ) );

		$return = array(
			'userData' => $user_data,
			'data'     => false,
			'enrolled' => false,
		);


		if ( empty($enrolled_courses) ) {
			return $return;
		}

		$return['enrolled'] = $enrolled_courses;

		$data = array();
		if ( null === $course_id ) {
			foreach ($enrolled_courses as $id) {
				$data[$id] = $this->get_user_data_by_course_id($user_id, $id);
				$data[$id]['mostRecent'] = $this->surface_only_most_recent_by_uuid($data[$id]);
			}
		} else {
			$data[$course_id] = $this->get_user_data_by_course_id($user_id, $course_id);
			$data[$course_id]['mostRecent'] = $this->surface_only_most_recent_by_uuid($data[$course_id]);
		}
		$return['data'] = $data;

		set_transient( $cache_key, $return, $cache_ttl );

		return $return;
	}

	public function run_student_action($action_data = array(
		'action' => '',
		'cohortId' => false,
		'courseId' => false,
		'uuid' => false,
		'data' => false,
		'userId' => '',
	)) {
		// Triple check data.
		$user_id = array_key_exists('courseId', $action_data) ? $action_data['userId'] : false;
		$course_id = array_key_exists('courseId', $action_data) ? $action_data['courseId'] : false;
		$cohort_id = array_key_exists('cohortId', $action_data) ? $action_data['cohortId'] : false;
		$uuid = array_key_exists('uuid', $action_data) ? $action_data['uuid'] : false;
		$action = array_key_exists('action', $action_data) ? $action_data['action'] : false;
		$data = array_key_exists('data', $action_data) && is_array($action_data['data']) ? $action_data['data'] : false;
		if ( false === $user_id ) {
			return new WP_Error('no-user-id', 'No user id passed to run_student_action', $action_data);
		}
		if ( false === $course_id ) {
			return new WP_Error('no-course-id', 'No course id passed to run_student_action', $action_data);
		}
		if ( false === $action ) {
			return new WP_Error('no-action', 'No action passed to run_student_action', $action_data);
		}
		if ( false === $data ) {
			return new WP_Error('no-data', 'No data passed to run_student_action', $action_data);
		}
		if ( false === $uuid ) {
			return new WP_Error('no-uuid', 'No uuid pased to run_student_action', $action_data);
		}

		$key = 'elms_'. md5($this->get_user_meta_key($user_id, $course_id));
		
		$now_data = get_user_meta($user_id, $key, true);

		if ( ! is_array($now_data) ) {
			$now_data = array(
				'courseId' => $course_id,
				'data' => array(),
			);
		}

		if ( ! array_key_exists($uuid, $now_data['data'] ) ) {
			$now_data['data'][$uuid] = array();
		}
		
		if ( ! array_key_exists($action, $now_data['data'][$uuid] ) ) {
			$now_data['data'][$uuid][$action] = array();
		}

		$right_now = new DateTime("now", wp_timezone());
		$timestamp = $right_now->getTimestamp();

		$now_data['data'][$uuid][$action][$timestamp] = $data;
		
		$success = update_user_meta( $user_id, $key, $now_data );
		if ( true !== $success ) {
			return new WP_Error('failed-to-run-action', 'Could not save data for ' . $action, $now_data);
		}

		// @TODO If cohort id then post to the group's activity feed.
		// https://codex.buddypress.org/plugindev/bp_activity_add-2/
		// https://buddypress.org/support/topic/how-to-attach-custom-activities-to-groups/

		// If false !== $cohort_id then check for buddypress and run this against buddypress group meta instead.
		if ( false !== $cohort_id ) {
			// $bp_group_id = groups_get_id( $slug );
			$bp_group_id = $cohort_id;
			if ( false !== $bp_group_id ) {
				$bp_key = 'elms_group_'. md5( $bp_group_id );
				$bp_now_data = groups_get_groupmeta( $bp_group_id, $bp_key );
				if ( ! is_array($bp_now_data) ) {
					$bp_now_data = array(
						'courseId' => $course_id,
						'data' => array(),
					);
				}
				if ( ! array_key_exists($uuid, $bp_now_data['data'] ) ) {
					$bp_now_data['data'][$uuid] = array();
				}
				if ( ! array_key_exists($action, $bp_now_data['data'][$uuid] ) ) {
					$bp_now_data['data'][$uuid][$action] = array();
				}
				$bp_now_data['data'][$uuid][$action][$timestamp] = $data;
				$bp_success = groups_update_groupmeta( $bp_group_id, $bp_key, $bp_now_data );
				if ( true !== $bp_success ) {
					return new WP_Error('failed-to-run-action', 'Could not save data for ' . $action, $bp_now_data);
				}
			}
		}

		error_log(print_r($now_data, true));

		return $now_data;
	}

	/**
	 * @TODO come back in here and make everything EXCEPT the $data an arg that gets type checked by wordpress instead of us. 
	 * @param WP_REST_Request $request 
	 * @return mixed 
	 */
	public function update_progress_restfully( \WP_REST_Request $request ) {
		$action_data = json_decode( $request->get_body(), true );
		$response = do_action('easyteach_student_action', $action_data);
		error_log('update_progress_restfully');
		error_log(print_r($action_data, true));
		error_log(print_r($response, true));
		return wp_json_encode( $response );
	}

	/**
	 * 
	 * 
	 * UNDER REVIEW:
	 * 
	 * 
	 * @param mixed $course_id 
	 * @param mixed $user_id 
	 * @return false|array 
	 */

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

	// public function update_progress_restfully( \WP_REST_Request $request ) {
	// 	$site_id   = get_current_blog_id();
	// 	$user_id   = (int) $request->get_param( 'userId' );
	// 	$course_id = (int) $request->get_param( 'courseId' );
	// 	$uuid      = $request->get_param( 'uuid' );
	// 	$status    = json_decode( $request->get_body(), true );

	// 	error_log( 'update_progress_restfully' );
	// 	error_log( print_r( $status, true ) );

	// 	if ( ! array_key_exists( 'completed', $status ) || true !== $status['completed'] ) {
	// 		return false;
	// 	}

	// 	$meta_key = "_course_{$course_id}_{$site_id}";

	// 	$data = get_user_meta( $user_id, $meta_key, true );
	// 	if ( ! is_array( $data ) ) {
	// 		$data = array(
	// 			'completed' => array(),
	// 			'scores'    => array(),
	// 		);
	// 	}
	// 	$data['completed'] = array_merge( $data['completed'], array( $uuid ) );

	// 	error_log( 'User ID' );
	// 	error_log( $user_id );
	// 	error_log( $meta_key );
	// 	error_log( print_r( $data, true ) );

	// 	// Log completion in group activity log
	// 	if ( class_exists( 'BP_Group_Extension' ) ) {
	// 		$attached_groups = get_post_meta( $course_id, '_attached_groups', true );
	// 		$users_groups    = groups_get_user_groups( $user_id );

	// 		error_log( 'users groups' );
	// 		error_log( print_r( $attached_groups, true ) );
	// 		error_log( print_r( $users_groups, true ) );

	// 		if ( array_key_exists( 'groups', $users_groups ) && is_array( $users_groups['groups'] ) ) {
	// 			foreach ( $attached_groups as $group_id ) {
	// 				error_log( 'group: ' . $group_id );
	// 				if ( in_array( $group_id, $users_groups['groups'] ) ) {
	// 					error_log( 'groups_record_activity' );
	// 					$action = sprintf( __( '%1$s completed %2$s', 'buddypress' ), bp_core_get_userlink( $user_id ), '<a href="#">' . esc_attr( get_the_title( $course_id ) ) . '</a>' );
	// 					// Get course from courseId, get outline.flat[uuid].title
	// 					$course_data  = $this->get_course( $course_id, $user_id );
	// 					$course_title = null;
	// 					foreach ( $course_data['outline']['flat'] as $course_elm ) {
	// 						if ( $uuid === $course_elm['uuid'] ) {
	// 							$course_title = $course_elm['title'];
	// 						}
	// 					}
	// 					error_log( print_r( $course_title, true ) );
	// 					$content_filtered = apply_filters( 'groups_activity_new_update_content', 'Completed ' . $course_title );
	// 					$permalink        = get_permalink( $course_id ) . '?uuid=' . $uuid;
	// 					groups_record_activity(
	// 						array(
	// 							// 'id'           => false,
	// 							'item_id'      => $group_id,
	// 							'user_id'      => $user_id,
	// 							'type'         => 'activity_update',
	// 							'action'       => $action,
	// 							'content'      => "<a href='{$permalink}'>{$content_filtered}</a>",
	// 							'primary_link' => $permalink,
	// 						)
	// 					);
	// 				} else {
	// 					error_log( 'NO GROUPS RECORD ACTIVITY' );
	// 				}
	// 			}
	// 		}
	// 	}

	// 	$data = update_user_meta( (int) $user_id, $meta_key, $data );
	// 	return $data;
	// }
}

new Student( true );