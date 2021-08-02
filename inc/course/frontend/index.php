<?php

class CourseFrontend extends EasyTeachLMS {
    public $js_handle = false;
    public $css_handle = false;

    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_assets' ) );
            add_filter('easyteach_frontend_course_js', function($handle) {
                if ( false === $this->js_handle ) {
                    $this->register_frontend_assets();
                }
                return $this->js_handle;
            }, 10, 1);
            add_filter('easyteach_frontend_course_css', function($handle) {
                if ( false === $this->css_handle ) {
                    $this->register_frontend_assets();
                }
                return $this->css_handle;
            }, 10, 1);

			add_filter('easyteach_course_render', array($this, 'render_frontend'), 10, 2);
        }
    }

	public function render_frontend($content, $data) {
		$post_id = $data['id'];
		$user_id = $data['user_id'];
		$enrolled = $data['enrolled'];

		if ( true === $enrolled ) {
			wp_enqueue_script( $this->js_handle );
			wp_enqueue_style( $this->css_handle );
		}
		
		if ( ! apply_filters('easyteach_is_this_user_enrolled', $post_id, $user_id) ) {
			$content = apply_filters('easyteach_course_enroll_gate', $post_id, $user_id);
		}

		return $content;
	}

    public function get_settings() {
		// Get the settings option object, default openEnrollment to true if not set.
		return get_option(
			'_easyteachlms_settings',
			array(
				'openEnrollment' => true,
			)
		);
	}

    /**
     * To override the frontend assets for the course and build out your own interface use these filters:
     * 
     * 1. easyteach_frontend_course_js
     * 2. easyteach_frontend_course_css
     * 
     * @return void 
     * @throws LogicException 
     */
    public function register_frontend_assets() {
		$enqueue = parent::wpackio();
		
        $course_frontend = $enqueue->register(
			'frontend',
			'course',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array(),
				'css_dep'   => array('wp-components'),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		$this->js_handle = array_pop( $course_frontend['js'] )['handle'];
        $this->css_handle = array_pop( $course_frontend['css'] )['handle'];

        $settings = $this->get_settings();
		wp_localize_script(
			$this->js_handle,
			'easyTeachSettings',
			$settings,
		);
		if ( 0 !== $user_data = wp_get_current_user() ) {
			wp_localize_script(
				$this->js_handle,
				'userData',
				array(
					'id'   => $user_data->ID,
					'name' => $user_data->display_name,
				)
			);
		}

	}
}

new CourseFrontend(true);