<?php

class Certificate extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_certificate($attributes, $content, $block) {
        wp_enqueue_script( apply_filters('easyteach_frontend_certificate_js', null) );
        wp_enqueue_style( apply_filters('easyteach_frontend_certificate_css', null) );
        
        $block_wrapper_attributes = get_block_wrapper_attributes( array(
            'data-uuid' => $attributes['uuid'],
        ) );
        $content = '<div '.$block_wrapper_attributes.'></div>';
        return $content;
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