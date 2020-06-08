<?php

namespace EasyTeachLMS;
use WPackio\Enqueue;

class Question {

    protected $js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n' );

    public function __construct( $init = false ) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    public function register_block() {
        $enqueue   = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );

		// Quiz
		$js_deps    = $this->js_deps;
        
        $question_block = $enqueue->register(
			'question-block',
			'block',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		register_block_type(
			'easyteachlms/question',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => array_pop( $question_block['js'] )['handle'],
				'editor_style'  => array_pop( $question_block['css'] )['handle'],
			)
		);
		
		$answer_block = $enqueue->register(
			'answer-block',
			'block',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		register_block_type(
			'easyteachlms/answer',
			array(
				// We're only enqueing these in the block editor, not the front end.
				'editor_script' => array_pop( $answer_block['js'] )['handle'],
				'editor_style'  => array_pop( $answer_block['css'] )['handle'],
			)
        );
    }
}

new Question(true);
