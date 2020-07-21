<?php
namespace EasyTeachLMS;

use WPackio\Enqueue;
class Certificates {
	protected $post_type = 'certificate';
	protected $js_deps   = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-compose', 'wp-polyfill', 'wp-i18n', 'wp-api' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'init' ) );
		}
	}

	public function init() {
		$args = array(
			'labels'              => array(
				'name'               => __( 'Certificates', 'post type general name' ),
				'singular_name'      => __( 'Certificate', 'post type singular name' ),
				'add_new'            => __( 'Add New' ),
				'add_new_item'       => __( 'Certificate' ),
				'edit_item'          => __( 'Edit Certificate' ),
				'new_item'           => __( 'New Certificate' ),
				'view_item'          => __( 'View Certificate' ),
				'search_items'       => __( 'Search Certificates' ),
				'not_found'          => __( 'No Certificate Found' ),
				'not_found_in_trash' => __( 'No Certificates in Trash' ),
				'parent_item_colon'  => __( 'Certificate' ),
				'menu_name'          => __( 'Certificates' ),
			),
			'singular_label'      => __( 'Certificate' ),
			'public'              => true,
			'exclude_from_search' => false,
			'show_ui'             => true,
			'publicly_queryable'  => true,
			'query_var'           => true,
			'capability_type'     => 'post',
			'has_archive'         => true,
			'hierarchical'        => false,
			'rewrite'             => array(
				'slug'       => 'certificate',
				'with_front' => false,
			),
			'show_in_rest'        => true,
			'supports'            => array( 'title', 'editor', 'revisions' ),
			'show_in_menu'        => 'easyteach-lms',
			'taxonomies'          => array(),
		);
		register_post_type( $this->post_type, $args );
		$this->register_block();
	}

	public function register_block() {
		// $enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );

		// // Certificate
		// $js_deps = $this->js_deps;

		// $certificate_block = $enqueue->register(
		// 'certificate-block',
		// 'block',
		// array(
		// 'js'        => true,
		// 'css'       => true,
		// 'js_dep'    => $js_deps,
		// 'css_dep'   => array( 'semantic-ui' ),
		// 'in_footer' => true,
		// 'media'     => 'all',
		// )
		// );

		// register_block_type(
		// 'easyteachlms/certificate',
		// array(
		// We're only enqueing these in the block editor, not the front end.
		// 'editor_script' => array_pop( $certificate_block['js'] )['handle'],
		// 'editor_style'  => array_pop( $certificate_block['css'] )['handle'],
		// )
		// );
	}
}

new Certificates( true );
