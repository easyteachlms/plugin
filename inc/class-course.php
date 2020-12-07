<?php

namespace EasyTeachLMS;

use WPackio\Enqueue;
class Course {
	protected $post_type        = 'course';
	public $assets              = array();
	protected $frontend_js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-dom-ready', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-api-fetch', 'wp-data', 'wp-url', 'wp-autop' );
	protected $block_js_deps    = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-mediaelement' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'register_assets' ) );
			add_action( 'init', array( $this, 'init' ) );
			add_filter( 'post_class', array( $this, 'is_enrolled_post_class' ), 10, 3 );
			add_action( 'enroll_user', array( $this, 'enroll' ), 10, 2 );
			add_action( 'unenroll_user', array( $this, 'unenroll' ), 10, 2 );
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_course_frontend' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'enroll_button_enqueue' ) );
			add_filter( 'the_excerpt', array( $this, 'enroll_button' ) );
			add_action( 'rest_api_init', array( $this, 'rest_routes' ) );
			add_filter( 'easyteachlms_course_structure', array( $this, 'check_enrollment' ), 10, 2 );

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

	public function enroll_button_enqueue() {
		if ( is_post_type_archive( $this->post_type ) ) {
			$enqueue    = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );
			$registered = $enqueue->enqueue(
				'app',
				'enrollButton',
				array(
					'js'        => true,
					'css'       => false,
					'js_dep'    => $this->frontend_js_deps,
					'css_dep'   => array( 'semantic-ui' ),
					'in_footer' => true,
					'media'     => 'all',
				)
			);
		}
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
		$settings = wp_json_encode( $this->get_settings() );
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

	public function enroll_button( $excerpt ) {
		if ( is_post_type_archive( $this->post_type ) && in_the_loop() && is_main_query() ) {
			$user_data = wp_get_current_user();
			if ( 0 === $user_data ) {
				return $excerpt;
			}
			$course_id = get_the_ID();
			$enrolled  = $this->is_enrolled( $course_id ) ? 'true' : 'false';
			// Check if already enrolled and display that here.
			ob_start();
			?>
			<div class="easyteachlms-enroll-button" data-enrolled=<?php echo esc_attr( $enrolled ); ?> data-userId=<?php echo $user_data->ID; ?> data-courseId=<?php echo $course_id; ?> data-courseLink=<?php echo get_permalink( $course_id ); ?>>Enroll Now</div>
			<?php
			$excerpt = $excerpt . ob_get_clean();
		}
		return $excerpt;
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
		} elseif ( ! in_array( $course_id, $data ) ) {
			$data[] = $course_id;
		} else {
			// User already enrolled don't enroll again.
			return;
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
		$site_id = get_current_blog_id();
		$courses = get_user_meta( (int) $user_id, '_enrolled_courses', true );
		$data    = array();

		$data_model = new Data_Model( false );

		foreach ( $courses as $course_id ) {
			error_log( 'get_enrolled_courses' );
			error_log( $site_id );
			$course = $data_model->get_course_structure( $course_id, $user_id, $site_id );
			error_log( print_r( $course, true ) );

			$progress          = get_user_meta( (int) $user_id, "_course_{$course_id}_{$site_id}", true );
			$progress['total'] = 100 * ( $course['outline']['completed'] / $course['outline']['total'] );

			$data[] = array(
				'title'    => $course['title'],
				'excerpt'  => $course['excerpt'],
				'progress' => $progress,
				'url'      => get_permalink( $course_id ),
			);
		}
		return $data;
	}

	public function my_courses_grid( $user_id = false ) {
		if ( false === $user_id ) {
			return;
		}
		$user_data = get_userdata( (int) $user_id );
		wp_localize_script(
			$this->assets['frontend']['my-courses']['script'],
			'myCoursesData',
			array(
				'id'      => $user_data->ID,
				'name'    => $user_data->data->user_nicename,
				'courses' => $this->get_enrolled_courses( $user_data->ID ),

			)
		);
		wp_enqueue_script( $this->assets['frontend']['my-courses']['script'] );
		wp_enqueue_style( $this->assets['frontend']['my-courses']['style'] );

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
