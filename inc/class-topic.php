<?php

namespace EasyTeachLMS;
use WPackio\Enqueue;
class Topic {
    protected $post_type = 'topic';
    protected $js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api' );

    public function __construct( $init = false ) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'init' ) );
        }
    }

    public function init() {
        $args = array(
            'labels'              => array(
                'name'               => __( 'Topics', 'post type general name' ),
                'singular_name'      => __( 'Topic', 'post type singular name' ),
                'add_new'            => __( 'Add New' ),
                'add_new_item'       => __( 'Topic' ),
                'edit_item'          => __( 'Edit Topic' ),
                'new_item'           => __( 'New Topic' ),
                'view_item'          => __( 'View Topic' ),
                'search_items'       => __( 'Search Topics' ),
                'not_found'          => __( 'No Topic Found' ),
                'not_found_in_trash' => __( 'No Topics in Trash' ),
                'parent_item_colon'  => __( 'Topic' ),
                'menu_name'          => __( 'Topics' ),
            ),
            'singular_label'      => __( 'Topic' ),
            'public'              => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'publicly_queryable'  => true,
            'query_var'           => true,
            'capability_type'     => 'post',
            'has_archive'         => true,
            'hierarchical'        => false,
            'rewrite'             => array(
                'slug'       => 'topic',
                'with_front' => false,
            ),
            'show_in_rest'        => true,
            'supports'            => array( 'title', 'editor', 'revisions', 'thumbnail', 'excerpt', 'author' ),
            'show_in_menu'        => 'easyteach-lms',
            'taxonomies'          => array( 'category' ),
        );
        register_post_type( $this->post_type, $args );
        $this->register_block();
    }

    public function register_block() {
        $enqueue   = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );

		// Topic
		$js_deps    = $this->js_deps;
        
        $topic_block = $enqueue->register(
			'topic-block',
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
			'easyteachlms/topic',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => array_pop( $topic_block['js'] )['handle'],
				'editor_style'  => array_pop( $topic_block['css'] )['handle'],
			)
        );
    }
}

new Topic(true);
