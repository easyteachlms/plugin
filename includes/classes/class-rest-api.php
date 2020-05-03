<?php
namespace EasyLMS;

class rest_api {
	public function __construct() {
		add_action( 'rest_api_init', array($this, 'set_rest_routes') );
		add_action( 'wp_ajax_nopriv_ajax_login', array($this, 'ajax_login_handler') );
		add_action( 'wp_ajax_nopriv_ajax_registration', array($this, 'ajax_registration_handler') );
	}

	public function set_rest_routes() {
		register_rest_route( 'easylms/v3', '/course/get', array(
            'methods' => 'GET',
            'callback' => array($this, 'rest_get_course_object'),
            'args' => array(
				'course_id' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ));

		register_rest_route( 'easylms/v3', '/course/enroll', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_enroll_user_in_course'),
            'args' => array(
                'uid' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
				'course_id' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ));

		register_rest_route( 'easylms/v3', '/course/unenroll', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_unenroll_user_in_course'),
            'args' => array(
                'uid' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
				'course_id' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ));

		$quiz = new quiz();
		register_rest_route( 'easylms/v3', '/quiz/grade', array(
            'methods' => 'POST',
            'callback' => array($quiz, 'rest_grade_quiz'),
            'args' => array(
				'course_id' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
				'module_id' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
				'answers' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return $param;
                    }
                ),
				'quiz_raw' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return $param;
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ));

        register_rest_route( 'easylms/v3', '/user-progress/get', array(
            'methods' => 'GET',
            'callback' => array($this, 'rest_get_user_progress'),
            'args' => array(
                'uid' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ));

        register_rest_route( 'easylms/v3', '/user-progress/update', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_update_user_progress'),
            'args' => array(
                'uid' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
				'course_id' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
                'module_slug' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
                'item_slug' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
                'status' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ) );

		register_rest_route( 'easylms/v3', '/cohort/create', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_create_cohort'),
            'args' => array(
                'uid' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
				'cohort_name' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ) );

		register_rest_route( 'easylms/v3', '/cohort/update', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_update_cohort'),
            'args' => array(
                'uid' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
				'cohort_key' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
                'students' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
                'owner' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'read' );
            }
        ) );

		register_rest_route( 'easylms/v3', '/cohort/assign', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_assign_student_to_cohort'),
			'args' => array(
				'uid' => array(
					'validate_callback' => function($param, $request, $key) {
						return is_numeric( $param );
					}
				),
				'cohort_key' => array(
					'validate_callback' => function($param, $request, $key) {
						return is_string( $param );
					}
				),
			),
			'permission_callback' => function () {
				return current_user_can( 'read' );
			}
		) );
	}

	public function rest_get_course_object( \WP_REST_Request $request ) {
		$course_id = $request->get_param( 'course_id' );
		$courses = new courses();
        $response = $courses->get_course_object( $course_id );
        return $response;
	}

	public function rest_get_user_progress( \WP_REST_Request $request ) {
        $user_id = $request->get_param( 'uid' );
        $response = get_user_meta( $user_id, '_user_course_progress', true );
        return $response;
    }

	public function update_user_progress( $user_id, $course_id, $module_slug, $item_slug, $status ) {
        $data = get_user_meta( $user_id, '_user_course_progress', true );

        if (!$data) {
            $data = array(
                $course_id => array(
					$module_slug => array(
	                    $item_slug => $status
	                ),
				),
            );
        } else {
            if ( 'module-req-complete' == $status && null == $item_slug ) {
                $data[$course_id][$module_slug]['pre-req'] = $status;
            } elseif( 'complete' == $data[$course_id][$module_slug][$item_slug] ) {
                $data[$course_id][$module_slug][$item_slug] = 'complete';
            } else {
                $data[$course_id][$module_slug][$item_slug] = $status;
            }
        }

        update_user_meta( $user_id, '_user_course_progress', $data );
		return $data;
	}

    public function rest_update_user_progress( \WP_REST_Request $request ) {
        $user_id = $request->get_param( 'uid' );
        $course_id = $request->get_param( 'course_id' );
		$module_slug = $request->get_param( 'module_slug' );
        $item_slug = $request->get_param( 'item_slug' );
        $status = $request->get_param( 'status' );

        // If we're marking a module as pre-req complete then we don't care about item data. It also gives a chance to key in two checks on the update_user_progress function.
        if ( 'module-req-complete' == $status ) {
            $item_slug = null;
        }

        return $this->update_user_progress( $user_id, $course_id, $module_slug, $item_slug, $status );
    }

	public function rest_enroll_user_in_course( \WP_REST_Request $request ) {
		$user_id = $request->get_param( 'uid' );
		$course_id = $request->get_param( 'course_id' );

		$data = get_user_meta( $user_id, '_enrolled_courses', true );
		if ( ! $data ) {
            $data = array( $course_id );
        } else {
            $data[] = $course_id;
        }

        update_user_meta( $user_id, '_enrolled_courses', $data );

		$index = get_post_meta( $course_id,  '_students_enrolled', true );
		if ( ! $index ) {
            $index = array( $user_id );
        } else {
            $index[] = $user_id;
        }
        update_post_meta( $course_id, '_students_enrolled', $index );

        return $data;
	}

	public function rest_unenroll_user_in_course( \WP_REST_Request $request ) {
		$user_id = $request->get_param( 'uid' );
		$course_id = $request->get_param( 'course_id' );
		$data = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( ! $data ) {
            return false;
        } else {
			$data = array_diff( $data, $course_id );
        }

        update_user_meta( $user_id, '_enrolled_courses', $data );

		$index = get_post_meta( $course_id,  '_students_enrolled', true );
		if ( $index ) {
            $index = array_diff( $index, $user_id );
        }
		update_post_meta( $course_id, '_students_enrolled', $index );

        return $data;
	}

	public function rest_create_cohort() {

	}

	//update/cohortkey
	public function rest_update_cohort() {

	}

	//assign/studentid/cohortkey
	public function rest_assign_student_to_cohort() {

	}


	/**
	 * [ajax_login_handler description]
	 * @return [type] [description]
	 */
	public function ajax_login_handler() {
		error_log('Notice: ajax_login_handler() was called');
		// First check the nonce, if it fails the function will break
		check_ajax_referer( 'ajax-login-nonce', 'security' );

		// Nonce is checked, get the POST data and sign user on
		$info = array();
		$info['user_login'] = $_POST['username'];
		$info['user_password'] = $_POST['password'];
		$info['remember'] = true;

		$user_signon = wp_signon( $info, false );
		if ( is_wp_error($user_signon) ){
			echo false;
		} else {
			echo true;
		}

		die();
	}

	/**
	 * [ajax_registration_handler description]
	 * @return [type] [description]
	 */
	public function ajax_registration_handler() {
		// First check the nonce, if it fails the function will break
		check_ajax_referer( 'ajax-login-nonce', 'security' );

		$userdata = array(
			'user_login'    => $_POST['username'],
			'user_email'    => $_POST['email'],
			'user_nicename' => $_POST['firstname'] . ' ' . $_POST['lastname'],
			'first_name'    => $_POST['firstname'],
			'last_name'     => $_POST['lastname'],
			'user_pass'      => $_POST['password']
		);

		$user_id = wp_insert_user( $userdata ) ;

		if ( ! is_wp_error( $user_id ) ) {
			$creds = array(
				'user_login'    => $userdata['user_login'],
				'user_password' => $userdata['user_pass'],
				'remember'      => true,
			);
			$user_signon = wp_signon( $creds, false );
			if ( is_wp_error($user_signon) ){
				echo "false";
			} else {
				echo "true";
			}
		} else {
			echo "false";
		}

		die();
	}

	// You can find the Restful function for grading quizzes in the class-quiz.php file.
}

new rest_api();
