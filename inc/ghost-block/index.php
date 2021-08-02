<?php

class Ghost_Block extends EasyTeachLMS {
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'register_block' ) );
		}
	}

	public function register_block() {
        $enqueue = parent::wpackio();
		
        $ghost_block = $enqueue->register(
			'blocks',
			'course',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n' ),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		register_block_type(
			'easyteachlms/ghost-block',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => array_pop( $ghost_block['js'] )['handle'],
			)
		);
	}
}

new Ghost_Block( true );
