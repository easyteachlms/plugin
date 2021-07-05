<?php
class Lesson_Content extends EasyTeachLMS {

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'init', array( $this, 'register_lesson_content_block' ) );
		}
	}

	public function render_lesson_content($attributes, $content, $block) {   
		$uuid = $attributes['uuid'];
		$parent_uuid = array_key_exists('lessonUuid', $block->context) ? $block->context['lessonUuid'] : false;
		$is_active = $uuid === get_query_var( 'content-uuid', false );
		
        $block_wrapper_attributes = get_block_wrapper_attributes( array(
			'data-parent-uuid' => $parent_uuid,
            'data-uuid' => $uuid,
			'data-title' => $attributes['title'],
			'data-active' => $is_active ? 'true' : 'false',
			'style' => !$is_active ? 'display: none;' : null,
        ) );

        return '<div '.$block_wrapper_attributes.'>'.$content.'</div>';
	}

	public function register_lesson_content_block() {
		$enqueue = parent::wpackio();
		
        $lesson_content_block = $enqueue->register(
			'blocks',
			'lessonContent',
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
			plugin_dir_path( __DIR__ ) . '/content',
			array(
				'editor_script' => array_pop( $lesson_content_block['js'] )['handle'],
				'editor_style'  => array_pop( $lesson_content_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_lesson_content' ),
			)
		);
	}
}

new Lesson_Content( true );
