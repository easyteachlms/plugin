<?php
/**
 * Provides data helpers and functionality to enforce course enrollment and drm/visibility.
 * @package 
 */
class Enrollment extends EasyTeachLMS {
	public $enroll_button_js_handle = false;

    public function __construct($init = false) {
        if ( true === $init ) {
			/**
			 * This filter is used in the data model and provides a `enrolled` class in the course data object wherever used.
			 */
            // add_filter( 'easyteach_course_structure', array( $this, 'verify_and_return_course_object' ), 10, 2 );
			
			/**
			 * This filter when passed with $user_id apply_filters('easyteach_get_user_courses', $user_id) will return a multidimensional array of the passed user's courses:
			 * Example output:
			 * array(
			 * 	 array(
			 * 	 	 'title' => 'Course Title',
			 * 	 	 'excerpt' => 'Course excerpt...',
			 * 	 	 'progress' => 50,
			 * 	 	 'url' => '.../course/course-title'
			 * 	 ) 
			 * ) ; 
			 * @return array
			 */
			add_filter( 'easyteach_get_user_courses', array($this, 'get_enrolled_courses'), 10, 1 );

			/**
			 * This filter when passed with $post_id and $user_id will return true or false if the $user_id is enrolled in the $post_id course.
			 * NOTE: Users with 'edit_others_posts' will return true every time.
			 */
			add_filter( 'easyteach_is_this_user_enrolled', array($this, 'is_user_enrolled'), 10, 2);
            
            /**
             * This filter, when passed with a $post_id and $user_id will return a enrollment gate for the given course (post_id). A button will display and clicking it will enroll the $user_id to the $post_id.
             */
            add_filter( 'easyteach_course_enroll_gate', array($this, 'default_enroll_gate'), 10, 2 );
			
			//
			add_filter( 'post_class', array( $this, 'is_enrolled_post_class' ), 10, 3 );
			add_action( 'wp_enqueue_scripts', array( $this, 'enroll_button_register' ) );
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
			add_filter( 'query_vars', array( $this, 'add_forceEnroll_queryvar' ) );
			
			/**
			 * These hooks allow you to use do_action('enroll_user', $user_id, $course_id) to programatically enroll a user, the same goes for unenroll_user.
			 */
			add_action( 'enroll_user', array( $this, 'enroll' ), 10, 2 );
			add_action( 'unenroll_user', array( $this, 'unenroll' ), 10, 2 );
        }
    }

	/**
	 * Check if a user is enrolled with a specific course.
	 * @param int $post_id 
	 * @param bool $user_id 
	 * @return bool 
	 */
	public function is_user_enrolled( int $post_id, $user_id = false ) {
		if ( ! $user_id ) {
			$user_id = get_current_user_id();
		}
		if ( ! $post_id ) {
			global $post;
			$post_id = $post->ID;
		}

		// All editors get access to all courses.
		if ( user_can( $user_id, 'edit_others_posts' ) ) {
			// return true;
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

	/**
     * Verifies the currently logged in user is enrolled in the course and adds an enrolled = true flag to the course object.
     * @param mixed $course_object 
     * @param mixed $post_id 
     * @return mixed 
     */
	public function verify_and_return_course_object( $course_object, $post_id ) {
		if ( true === $this->is_user_enrolled( $post_id ) ) {
			$course_object['enrolled'] = true;
		}
		return $course_object;
	}

	public function get_enrolled_courses( int $user_id = 0 ) {
		if ( !$user_id ) {
			return;
		}
		$courses = get_user_meta( (int) $user_id, '_enrolled_courses', true );

		$data = array();

		foreach ( $courses as $course_id ) {
			$course = get_post( $course_id );
			if ( ! is_wp_error( $course ) ) {
				$data[] = array(
					'title'    => $course->post_title,
					'excerpt'  => get_the_excerpt( $course_id ),
					'progress' => 0,
					'url'      => get_permalink( $course_id ),
				);
			}
			wp_reset_postdata();
		}

		return $data;
	}

	public function is_enrolled_post_class( $classes, $class, $post_id ) {
		if ( true === $this->is_user_enrolled( $post_id ) ) {
			$classes[] = 'is-enrolled';
		} else {
			$classes[] = 'is-not-enrolled';
		}
		return $classes;
	}

	public function enroll_button_register() {
		$button_js = parent::wpackio()->enqueue(
			'frontend',
			'enrollButton',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => array(),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

        $this->enroll_button_js_handle = array_pop( $button_js['js'] )['handle'];
	}

	public function default_enroll_gate($course_id, $user_id = false) {
		wp_enqueue_script( $this->enroll_button_js_handle );
		return wp_sprintf( '<div class="easyteach-enroll-gate"><h2>%s</h2><p><button class="js-enroll-in-course-button button" data-course-id="%s" data-user-id="%s">%s</button></p></div>', 'You are not currently enrolled in this course', $course_id, $user_id, 'Enroll in this course' );
	}

	public function register_rest_endpoints() {
		/**
		 * Enroll a user to a course.
		 */
		register_rest_route(
			'easyteachlms/v4',
			'/course/enroll',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_enroll_user' ),
				'args'                => array(
					'userId'   => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'courseId' => array(
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
		
		/**
		 * Un-enroll a user from a course.
		 */
		register_rest_route(
			'easyteachlms/v4',
			'/course/unenroll',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_unenroll_user' ),
				'args'                => array(
					'userId'   => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'courseId' => array(
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

		/**
		 * For use in the courses enroll gate, if the user is not logged in you can use this endpoint to redirec them to wp-login
		 */
		register_rest_route(
			'easyteachlms/v4',
			'/course/redirect-to-login',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'restfully_redirect_to_login' ),
				'args'                => array(
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true; // Allow the public to redirect to wp-login.php. 
				},
			)
		);
	}

	public function restfully_enroll_user( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'userId' );
		$course_id = $request->get_param( 'courseId' );
		return $this->enroll( $user_id, $course_id );
	}

	public function restfully_unenroll_user( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'userId' );
		$course_id = $request->get_param( 'courseId' );
		return $this->unenroll( $user_id, $course_id );
	}

	public function restfully_redirect_to_login( \WP_REST_Request $request ) {
		$course_id   = $request->get_param( 'courseId' );
		$redirect_to = add_query_arg( array(
			'forceEnroll' => true,
			'nonce' => wp_create_nonce(wp_json_encode( $request )),
		), get_permalink( (int) $course_id ) );
		return wp_login_url( $redirect_to );
	}

	public function add_forceEnroll_queryvar($qvars) {
		$qvars[] = 'forceEnroll';
		return $qvars;
	}

	public function force_enrollment() {
		if ( !is_singular('course') ) {
			return;
		}
		if ( true === get_query_var( 'forceEnroll', false ) ) {
			$user_id = get_current_user_id();
			$course_id = get_the_ID();
			if (false === $this->is_user_enrolled($course_id, $user_id) ) {
				$this->enroll( $user_id, $course_id );
			}
		}
	}

    public function log_enrollment_on_course( $user_id, $course_id ) {
		if ( ! $user_id || ! $course_id ) {
			return false;
		}

		$data = get_post_meta( $course_id, '_enrolled_users', true );

		if ( ! $data ) {
			$data = array( $user_id );
		} else {
			$data[] = $user_id;
		}

		return update_post_meta( $course_id, '_enrolled_users', $data );
	}

	public function enroll( $user_id, $course_id ) {
		if ( ! $user_id || ! $course_id ) {
			return false;
		}

		$data = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( ! $data ) {
			$data = array( $course_id );
		} elseif ( ! in_array( $course_id, $data ) ) {
			$data[] = $course_id;
		} else {
			// User already enrolled don't enroll again.
			return;
		}
		$this->log_enrollment_on_course( $user_id, $course_id );
		return update_user_meta( $user_id, '_enrolled_courses', $data );
	}

	public function unenroll( $user_id, $course_id ) {
		if ( ! $user_id || ! $course_id ) {
			return false;
		}

		$data = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( ! $data ) {
			return false;
		} else {
			$data = array_diff( $data, array( $course_id ) );
		}

		update_user_meta( $user_id, '_enrolled_courses', $data );

		$index = get_post_meta( $course_id, '_enrolled_users', true );
		if ( $index ) {
			$index = array_diff( $index, array( $user_id ) );
		}
		update_post_meta( $course_id, '_enrolled_users', $index );

		return $data;
	}

	/**
	 * Once a month we should clean out the enrollment roster on courses if the user isn't active or deleted?
	 * @return void 
	 */
	public function cron_clean_roster() {

	}
}

new Enrollment(true);