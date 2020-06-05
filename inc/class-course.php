<?php

namespace EasyTeachLMS;
use WPackio\Enqueue;
class Course {
    protected $post_type = 'course';
    protected $js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api' );

    public function __construct( $init = false ) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'init' ) );
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
            'template' => array(
                array( 'easyteachlms/course', array() ),
            ),
        );
        register_post_type( $this->post_type, $args );
        $this->register_block();
    }

    public function register_block() {
        $enqueue   = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );

		// Course
		$js_deps    = $this->js_deps;
        
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
        error_log(print_r($course_block, true));
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
}

new Course(true);
