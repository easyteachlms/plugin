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

	// Certificates At the end of the course should be another innerblocks area, or rather, maybe its a block that gets dropped in. Either way we need an innerblock area for certificates, you'd be able to add images, headings, paragraphs, lists, and then we'd have some child blocks like Student Name, Student Score, Date, Course Name.

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
