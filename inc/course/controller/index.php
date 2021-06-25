<?php
/**
 * For the course data model see `/inc/class-data-model.php`
 * @package 
 */

class Course extends EasyTeachLMS {
	protected $post_type        = 'course';

	protected $frontend_js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-dom-ready', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-api-fetch', 'wp-data', 'wp-url', 'wp-autop' );

	protected $block_js_deps    = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api', 'wp-mediaelement', 'wp-primitives' );

	/**
	 * @param bool $init 
	 * @return void 
	 */
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'register_course_post_type' ) );
			add_action( 'init', array( $this, 'register_course_block' ) );
		}
	}

	public function register_course_post_type() {
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
	}

	public function render_course($attributes, $content, $block) {
		wp_enqueue_script( apply_filters('easyteach_frontend_course_js', null) );
        wp_enqueue_style( apply_filters('easyteach_frontend_course_css', null) );
        
        $block_wrapper_attributes = get_block_wrapper_attributes( array(
            'data-course-id' => $attributes['id'],
        ) );
        return '<div '.$block_wrapper_attributes.'></div>';
	}

	public function register_course_block() {
		$enqueue = parent::wpackio();
		
        $course_block = $enqueue->register(
			'blocks',
			'course',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n' ),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
        
        register_block_type_from_metadata(
			plugin_dir_path( __DIR__ ) . '/controller',
			array(
				'editor_script' => array_pop( $course_block['js'] )['handle'],
				'editor_style'  => array_pop( $course_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_course' ),
			)
		);
	}
}

new Course( true );
