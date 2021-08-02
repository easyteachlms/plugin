<?php

class Certificate extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_certificate($attributes, $content, $block) {
        $block_wrapper_attributes = get_block_wrapper_attributes( array(
            'data-uuid' => $attributes['uuid'],
			'style' => wp_sprintf( 'border-color: %s; background-color: %s', $attributes['borderColor'], $attributes['backgroundColor']),
        ) );
        return '<div '.$block_wrapper_attributes.'>'.$content.'</div>';
    }

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $certificate_block = $enqueue->register(
			'blocks',
			'certificate',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array(),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
        
        register_block_type_from_metadata(
			plugin_dir_path( __DIR__ ) . '/controller',
			array(
				'editor_script' => array_pop( $certificate_block['js'] )['handle'],
				'editor_style' => array_pop( $certificate_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_certificate' ),
			)
		);
	}
}

new Certificate(true);