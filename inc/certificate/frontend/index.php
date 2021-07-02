<?php

class CertificateFrontend extends EasyTeachLMS {
    public $js_handle = false;
    public $css_handle = false;

    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_assets' ) );
            add_filter('easyteach_frontend_certificate_js', function($handle) {
                if ( false === $this->js_handle ) {
                    $this->register_frontend_assets();
                }
                return $this->js_handle;
            }, 10, 1);
            add_filter('easyteach_frontend_certificate_css', function($handle) {
                if ( false === $this->css_handle ) {
                    $this->register_frontend_assets();
                }
                return $this->css_handle;
            }, 10, 1);
        }
    }

    /**
     * To override the frontend assets for the quiz and build out your own interface use these filters:
     * 
     * 1. easyteach_frontend_quiz_js
     * 2. easyteach_frontend_quiz_css
     * 
     * @return void 
     * @throws LogicException 
     */
    public function register_frontend_assets() {
		$enqueue = parent::wpackio();
		
        $certificate_frontend = $enqueue->register(
			'frontend',
			'quiz',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array(),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

        $this->js_handle = array_pop( $certificate_frontend['js'] )['handle'];
        $this->css_handle = array_pop( $certificate_frontend['css'] )['handle'];
	}
}

new CertificateFrontend(true);