<?php

class Question extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_question($attributes, $content, $block) {
        $block_wrapper_attributes = get_block_wrapper_attributes();

        return '<div '.$block_wrapper_attributes.'>'.$content.'</div>';
    }

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $question_block = $enqueue->register(
			'blocks',
			'quizQuestion',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n' ),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
        
        register_block_type_from_metadata(
			plugin_dir_path( __DIR__ ) . '/question',
			array(
				'editor_script' => array_pop( $question_block['js'] )['handle'],
				'editor_style'  => array_pop( $question_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_question' ),
			)
		);
	}
}

new Question(true);