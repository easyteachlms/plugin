<?php

class Answer extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_answer($attributes, $content, $block) {
        return $content;
    }

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $answer_block = $enqueue->register(
			'blocks',
			'quizAnswer',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n' ),
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
        
        register_block_type_from_metadata(
			plugin_dir_path( __DIR__ ) . '/answer',
			array(
				'editor_script' => array_pop( $answer_block['js'] )['handle'],
				// 'editor_style'  => array_pop( $answer_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_answer' ),
			)
		);
	}
}

new Answer(true);