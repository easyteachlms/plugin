<?php

class Answer extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function render_answer($attributes, $content, $block) {
        $block_wrapper_attributes = get_block_wrapper_attributes();

        return '<div '.$block_wrapper_attributes.'>'.$content.'</div>';
    }

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $answer_block = $enqueue->register(
			'blocks',
			'quizAnswer',
			array(
				'js'        => true,
				'css'       => false,
				'js_dep'    => array(),
				'css_dep'   => array(),
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