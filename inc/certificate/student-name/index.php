<?php

class CertificateStudentName extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_student_name($attributes, $content, $block) {    
        // get user and get info
        $block_wrapper_attributes = get_block_wrapper_attributes( array(
            'data-user-name' => null,
        ) );
        $content = '<div '.$block_wrapper_attributes.'></div>';
        return $content;
    }

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $certificate_block = $enqueue->register(
			'blocks',
			'certificateStudentName',
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
			plugin_dir_path( __DIR__ ) . '/student-name',
			array(
				'editor_script' => array_pop( $certificate_block['js'] )['handle'],
				'render_callback' => array( $this, 'render_student_name' ),
			)
		);
	}
}

new CertificateStudentName(true);