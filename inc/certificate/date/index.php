<?php

class CertificateDate extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_date($attributes, $content, $block) {    
        // get todays date
        $block_wrapper_attributes = get_block_wrapper_attributes();
		$todays_date = date('d-m-Y');;
        return '<div '.$block_wrapper_attributes.'>'.$todays_date.'</div>';
    }

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $certificate_block = $enqueue->register(
			'blocks',
			'certificateDate',
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
			plugin_dir_path( __DIR__ ) . '/date',
			array(
				'editor_script' => array_pop( $certificate_block['js'] )['handle'],
				'render_callback' => array( $this, 'render_date' ),
			)
		);
	}
}

new CertificateDate(true);