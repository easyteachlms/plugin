<?php

namespace EasyTeachLMS;

use WPackio\Enqueue;
class Course {
	protected $post_type        = 'course';
	protected $frontend_js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-dom-ready', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-api-fetch', 'wp-data', 'wp-url' );
	protected $block_js_deps    = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'init' ) );
			add_filter( 'post_class', array( $this, 'is_enrolled_post_class' ), 10, 3 );
			add_action( 'enroll_user', array( $this, 'enroll' ), 10, 2 );
			add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend' ) );
			add_filter( 'the_content', array( $this, 'enroll_button' ) );
			add_action( 'rest_api_init', array( $this, 'rest_routes' ) );
			add_filter( 'easyteachlms_course_structure', array( $this, 'check_enrollment' ), 10, 2 );
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

	public function register_frontend() {
		if ( ! is_singular( 'course' ) ) {
			return;
		}

		$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );
		$js_deps = $this->frontend_js_deps;

		$course_frontend = $enqueue->register(
			'app',
			'course',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		$script = array_pop( $course_frontend['js'] )['handle'];
		$style  = array_pop( $course_frontend['css'] )['handle'];

		if ( 0 !== $user_data = wp_get_current_user() ) {
			wp_localize_script(
				$script,
				'userData',
				array(
					'id'   => $user_data->ID,
					'name' => $user_data->data->user_nicename,
				)
			);
		}

		wp_enqueue_script( $script );
		wp_enqueue_style( $style );
	}

	public function register_block() {
		$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );
		$js_deps = $this->block_js_deps;

		$course_block = $enqueue->register(
			'course-block',
			'block',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		register_block_type(
			'easyteachlms/course',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => array_pop( $course_block['js'] )['handle'],
				'editor_style'  => array_pop( $course_block['css'] )['handle'],
			)
		);

		// @TODO: This belongs elsewhere:
		$ghost_block = $enqueue->register(
			'ghost-block',
			'block',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => $js_deps,
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		register_block_type(
			'sethrubenstein/ghost-block',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => array_pop( $ghost_block['js'] )['handle'],
				'editor_style'  => array_pop( $ghost_block['css'] )['handle'],
			)
		);
	}

	public function rest_routes() {
		register_rest_route(
			'easyteachlms/v3',
			'/course/enroll',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_enroll_user_in_course' ),
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
	}

	public function enroll_button( $content ) {
		if ( is_post_type_archive( $this->post_type ) && in_the_loop() && is_main_query() ) {
			ob_start();
			?>
			<a href="#" class="ui primary button">Enroll</a>
			<?php
			$content = $content . ob_get_clean();
		}
		return $content;
	}

	public function rest_enroll_user_in_course( \WP_REST_Request $request ) {
		$user_id   = $request->get_param( 'userId' );
		$course_id = $request->get_param( 'courseId' );
		return $this->enroll( $user_id, $course_id );
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

	public function check_enrollment( $course_structure, $post_id ) {
		if ( true === $this->is_enrolled( $post_id ) ) {
			$course_structure['enrolled'] = true;
		}
		return $course_structure;
	}

	public function enroll( $user_id, $course_id ) {
		if ( ! $user_id || ! $course_id ) {
			return false;
		}

		$data = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( ! $data ) {
			$data = array( $course_id );
		} else {
			$data[] = $course_id;
		}
		$this->log_enrollment_on_course( $user_id, $course_id );
		return update_user_meta( $user_id, '_enrolled_courses', $data );
	}

	public function is_enrolled( int $post_id ) {
		if ( ! $post_id ) {
			global $post;
			$post_id = $post->ID;
		}

		$user_id = get_current_user_id();
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
		// $user_id   = $request->get_param( 'userId' );
		// $course_id = $request->get_param( 'courseId' );
		// $data      = get_user_meta( $user_id, '_enrolled_courses', true );

		// if ( ! $data ) {
		// return false;
		// } else {
		// $data = array_diff( $data, $course_id );
		// }

		// update_user_meta( $user_id, '_enrolled_courses', $data );

		// $index = get_post_meta( $course_id, '_students_enrolled', true );
		// if ( $index ) {
		// $index = array_diff( $index, $user_id );
		// }
		// update_post_meta( $course_id, '_students_enrolled', $index );

		// return $data;
	}

	public function cron_clean_roster() {
		// twice a month we should look at
	}
}

new Course( true );
