<?php
class Lesson extends EasyTeachLMS {
	protected $post_type = 'lesson';

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'register_lesson_post_type' ) );
			add_action( 'init', array( $this, 'register_lesson_block' ) );
		}
	}

	public function register_lesson_post_type() {
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
	}

	public function show_post_content_raw( $object, $field_name, $request ) {
		return get_post( $object['id'] )->post_content;
	}

	public function check_schedule($attributes) {
		if ( !array_key_exists('schedule', $attributes) ) {
			return true;
		}
		$scheduled_date = new DateTime($attributes['schedule']);
		$current_date = new DateTime();
		// If todays date is before the $scheduled_date then return false;
		return $scheduled_date <= $current_date;
	}

	public function render_lesson($attributes, $content, $block) {
		wp_enqueue_script( apply_filters('easyteach_frontend_lesson_js', null) );
        wp_enqueue_style( apply_filters('easyteach_frontend_lesson_css', null) );
        //  Check for schedule, if not correct then DO NOT DISPLAY.
		
		$content = $this->check_schedule($attributes) ? $content : wp_sprintf( 'This lesson will unlock at: %s', date('d-m-y', $attributes['schedule']) );
        
		$block_wrapper_attributes = get_block_wrapper_attributes( array(
            'data-uuid' => $attributes['uuid'],
			'data-title' => $attributes['title'],
        ) );

        return '<div '.$block_wrapper_attributes.'>'.$content.'</div>';
	}

	public function register_lesson_block() {
		$enqueue = parent::wpackio();
		
        $lesson_block = $enqueue->register(
			'blocks',
			'lesson',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array('wp-api'),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
        
        register_block_type_from_metadata(
			plugin_dir_path( __DIR__ ) . '/controller',
			array(
				'editor_script' => array_pop( $lesson_block['js'] )['handle'],
				'editor_style'  => array_pop( $lesson_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_lesson' ),
			)
		);
	}

}

new Lesson( true );
