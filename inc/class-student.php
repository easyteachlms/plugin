<?php
namespace EasyTeachLMS;

use WPackio\Enqueue;
class Student {
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
		}
	}

	public function is_enrolled_in_course( int $post_id ) {
		if ( ! $post_id ) {
			global $post;
			$post_id = $post->ID;
		}

		$user_id = get_current_user_id();
		// All editors get access to all courses.
		if ( user_can( $user_id, 'edit_others_posts' ) ) {
			return true;
		}
		$courses = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( empty( $courses ) ) {
			return false;
		} elseif ( in_array( $post_id, $courses ) ) {
			return true;
		} else {
			return false;
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

	public function register_rest_endpoint() {
		register_rest_route(
			'easyteachlms/v3',
			'/student/get',
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
					'newScore' => array(
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
				$meta_key = "_course_{$course_id}_{$site_id}";
				// $course_data = get_user_meta( $user_id, $meta_key, true );
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

	public function update_quiz_progress_restfully( \WP_REST_Request $request ) {
		$site_id   = get_current_blog_id();
		$user_id   = (int) $request->get_param( 'userId' );
		$course_id = (int) $request->get_param( 'courseId' );
		$uuid      = $request->get_param( 'uuid' );
		$new_score = $request->get_param( 'newScore' );

		error_log( 'new Score??' );
		error_log( print_r( gettype( $new_score ), true ) );

		$meta_key = "_course_{$course_id}_{$site_id}";

		if ( null !== $new_score ) {
			$user_data = get_user_meta( $user_id, $meta_key, true );
			if ( is_array( $user_data ) && array_key_exists( 'scores', $user_data ) && array_key_exists( $uuid, $user_data['scores'] ) ) {
				$user_data = $user_data['scores'][ $uuid ];
			} else {
				return new WP_Error( 'quiz-score-issue', 'Could not correctly ascertain the user data to update quiz score.' );
			}
			$user_data['score'] = $new_score;
		} else {
			$user_data = json_decode( $request->get_body(), true );
		}

		error_log( 'update_quiz_progress_restfully!!' );
		error_log( print_r( $user_data, true ) );

		if ( ! array_key_exists( 'score', $user_data ) && ! array_key_exists( 'total', $user_data ) && ! array_key_exists( 'pointsRequiredToPass', $user_data ) ) {
			return false;
		}

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
