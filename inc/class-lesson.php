<?php
namespace EasyTeachLMS;

use WPackio\Enqueue;
class Lesson {
	protected $post_type = 'lesson';
	protected $js_deps   = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-compose', 'wp-polyfill', 'wp-i18n', 'wp-api', 'moment' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'init' ) );
		}
	}

	public function init() {
		$args = array(
			'labels'              => array(
				'name'               => __( 'Lessons', 'post type general name' ),
				'singular_name'      => __( 'Lesson', 'post type singular name' ),
				'add_new'            => __( 'Add New' ),
				'add_new_item'       => __( 'Lesson' ),
				'edit_item'          => __( 'Edit Lesson' ),
				'new_item'           => __( 'New Lesson' ),
				'view_item'          => __( 'View Lesson' ),
				'search_items'       => __( 'Search Lessons' ),
				'not_found'          => __( 'No Lesson Found' ),
				'not_found_in_trash' => __( 'No Lessons in Trash' ),
				'parent_item_colon'  => __( 'Lesson' ),
				'menu_name'          => __( 'Lessons' ),
			),
			'singular_label'      => __( 'Lesson' ),
			'public'              => true,
			'exclude_from_search' => false,
			'show_ui'             => true,
			'publicly_queryable'  => true,
			'query_var'           => true,
			'capability_type'     => 'post',
			'has_archive'         => true,
			'hierarchical'        => false,
			'rewrite'             => array(
				'slug'       => 'lesson',
				'with_front' => false,
			),
			'show_in_rest'        => true,
			'supports'            => array( 'title', 'editor', 'revisions', 'excerpt', 'author' ),
			'show_in_menu'        => 'easyteach-lms',
			'taxonomies'          => array(),
			'template'            => array(
				array( 'easyteachlms/lesson-content', array() ),
			),
		);
		register_post_type( $this->post_type, $args );

		add_action(
			'rest_api_init',
			function() {
				$post_content_raw_schema = array(
					'description' => 'Content for the object, as it exists in the database.',
					'type'        => 'string',
					'context'     => array( 'view' ),
				);
				// @TODO Come back to this, we may need to change this to lessons?
				register_rest_field(
					'lesson',
					'content_raw',
					array(
						'get_callback' => array( $this, 'show_post_content_raw' ),
						'schema'       => $post_content_raw_schema,
					)
				);
			}
		);

		$this->register_block();
	}

	public function show_post_content_raw( $object, $field_name, $request ) {
		return get_post( $object['id'] )->post_content;
	}

	public function register_block() {
		$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );

		$js_deps = $this->js_deps;

		$lesson_block = $enqueue->register(
			'lesson-block',
			'block',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $js_deps,
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		register_block_type(
			'easyteachlms/lesson',
			array(
				'editor_script' => array_pop( $lesson_block['js'] )['handle'],
				'editor_style'  => array_pop( $lesson_block['css'] )['handle'],
			)
		);

		$lesson_content_block = $enqueue->register(
			'lesson-content-block',
			'block',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $js_deps,
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			),
		);
		register_block_type(
			'easyteachlms/lesson-content',
			array(
				'editor_script' => array_pop( $lesson_content_block['js'] )['handle'],
				'editor_style'  => array_pop( $lesson_content_block['css'] )['handle'],
			)
		);
	}

}

new Lesson( true );
