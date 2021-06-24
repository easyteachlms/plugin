<?php

namespace EasyTeachLMS;

use WPackio\Enqueue;
class Course {
	protected $post_type        = 'course';
	public $assets              = array();
	protected $frontend_js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-dom-ready', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-api-fetch', 'wp-data', 'wp-url', 'wp-autop' );
	protected $block_js_deps    = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-mediaelement', 'wp-primitives' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'register_assets' ) );
			add_action( 'init', array( $this, 'init' ) );
			
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_course_frontend' ) );

			// My Courses:
			add_action( 'easyteachlms_woocom_courses', array( $this, 'woocom_purchased_courses_grid' ), 10, 1 );
		}
	}

	public function init() {
		$args = array(
			'labels'              => array(
				'name'               => __( 'Courses', 'post type general name' ),
				'singular_name'      => __( 'Course', 'post type singular name' ),
				'add_new'            => __( 'Add New' ),
				'add_new_item'       => __( 'Course' ),
				'edit_item'          => __( 'Edit Course' ),
				'new_item'           => __( 'New Course' ),
				'view_item'          => __( 'View Course' ),
				'search_items'       => __( 'Search Courses' ),
				'not_found'          => __( 'No Course Found' ),
				'not_found_in_trash' => __( 'No Courses in Trash' ),
				'parent_item_colon'  => __( 'Course' ),
				'menu_name'          => __( 'Courses' ),
			),
			'singular_label'      => __( 'Course' ),
			'public'              => true,
			'exclude_from_search' => false,
			'show_ui'             => true,
			'publicly_queryable'  => true,
			'query_var'           => true,
			'capability_type'     => 'post',
			'has_archive'         => true,
			'hierarchical'        => false,
			'rewrite'             => array(
				'slug'       => 'course',
				'with_front' => false,
			),
			'show_in_rest'        => true,
			'supports'            => array( 'title', 'editor', 'revisions', 'thumbnail', 'excerpt', 'author' ),
			'show_in_menu'        => 'easyteach-lms',
			'taxonomies'          => array( 'category' ),
			'template'            => array(
				array( 'easyteachlms/course', array() ),
			),
		);
		register_post_type( $this->post_type, $args );
		$this->register_block();
	}

	public function register_assets() {
		$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );

		$course_block                    = $enqueue->register(
			'course-block',
			'block',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $this->block_js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		$this->assets['block']['course'] = array(
			'script' => array_pop( $course_block['js'] )['handle'],
			'style'  => array_pop( $course_block['css'] )['handle'],
		);

		$ghost_block                    = $enqueue->register(
			'ghost-block',
			'block',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => $this->block_js_deps,
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		$this->assets['block']['ghost'] = array(
			'script' => array_pop( $ghost_block['js'] )['handle'],
		);

		$course_app                         = $enqueue->register(
			'app',
			'course',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $this->frontend_js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		$this->assets['frontend']['course'] = array(
			'script' => array_pop( $course_app['js'] )['handle'],
			'style'  => array_pop( $course_app['css'] )['handle'],
		);

		$my_courses                             = $enqueue->register(
			'app',
			'myCourses',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => $this->frontend_js_deps,
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		$this->assets['frontend']['my-courses'] = array(
			'script' => array_pop( $my_courses['js'] )['handle'],
		);
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

	public function enqueue_course_frontend() {
		if ( ! is_singular( 'course' ) ) {
			return;
		}
		$settings = $this->get_settings();
		wp_localize_script(
			$this->assets['frontend']['course']['script'],
			'easyTeachSettings',
			$settings,
		);
		if ( 0 !== $user_data = wp_get_current_user() ) {
			wp_localize_script(
				$this->assets['frontend']['course']['script'],
				'userData',
				array(
					'id'   => $user_data->ID,
					'name' => $user_data->display_name,
				)
			);
		}
		wp_enqueue_script( $this->assets['frontend']['course']['script'] );
		wp_enqueue_style( $this->assets['frontend']['course']['style'] );
	}

	public function register_block() {
		register_block_type(
			'easyteachlms/course',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => $this->assets['block']['course']['script'],
				'editor_style'  => $this->assets['block']['course']['style'],
			)
		);

		register_block_type(
			'sethrubenstein/ghost-block',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => $this->assets['block']['ghost']['script'],
			)
		);
	}

	public function rest_routes() {
		register_rest_route(
			'easyteachlms/v3',
			'/course/redirect-to-login',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'rest_redirect_to_login' ),
				'args'                => array(
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;
				},
			)
		);
	}

	public function rest_redirect_to_login( \WP_REST_Request $request ) {
		$course_id   = $request->get_param( 'courseId' );
		$redirect_to = get_permalink( (int) $course_id );
		return wp_login_url( $redirect_to );
	}

	public function my_courses_grid( $user_id = false ) {
		if ( false === $user_id ) {
			return;
		}
		if ( empty( $this->assets ) ) {
			$this->register_assets();
		}
		if ( empty( $this->assets ) ) {
			return '<h2>No Scripts</h2>';
		}

		$user_data = get_userdata( (int) $user_id );

		wp_localize_script(
			$this->assets['frontend']['my-courses']['script'],
			'myCoursesData',
			array(
				'id'      => $user_data->ID,
				'name'    => $user_data->data->user_nicename,
				'courses' => apply_filters('easyteach_get_user_courses', $user_data->ID),
			)
		);
		wp_enqueue_script( $this->assets['frontend']['my-courses']['script'] );

		return "<div id='easyteachlms-enrolled-courses' data-user-id={$user_id}></div>";
	}

	public function woocom_purchased_courses_grid( $user_id = false ) {
		if ( false === $user_id ) {
			return;
		}
		echo $this->my_courses_grid( $user_id );
	}
}

new Course( true );
