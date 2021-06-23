<?php

class Enrollment extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_filter( 'easyteachlms_course_structure', array( $this, 'verify_and_return_course_object' ), 10, 2 );
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

    /**
     * Verifies the currently logged in user is enrolled in the course and adds an enrolled = true flag to the course object.
     * @param mixed $course_object 
     * @param mixed $post_id 
     * @return mixed 
     */
	public function verify_and_return_course_object( $course_object, $post_id ) {
		if ( true === $this->is_current_user_enrolled( $post_id ) ) {
			$course_object['enrolled'] = true;
		}
		return $course_object;
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

	public function is_current_user_enrolled( int $post_id ) {
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

	public function is_enrolled_post_class( $classes, $class, $post_id ) {
		if ( true === $this->is_enrolled( $post_id ) ) {
			$classes[] = 'user-enrolled';
		} else {
			$classes[] = 'user-not-enrolled';
		}
		return $classes;
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

	public function cron_clean_roster() {
		// twice a month we should look at
	}

	public function get_enrolled_courses( $user_id = false ) {
		if ( false === $user_id ) {
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
}