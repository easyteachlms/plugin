<?php

class Quiz extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            add_action( 'init', array( $this, 'register_block' ) );
            add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
        }
    }

    public function render_quiz($attributes, $content, $block) {        
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

    public function register_block() {
		$enqueue = parent::wpackio();
		
        $quiz_block = $enqueue->register(
			'blocks',
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
        
        register_block_type_from_metadata(
			plugin_dir_path( __DIR__ ) . '/controller',
			array(
				'editor_script' => array_pop( $quiz_block['js'] )['handle'],
				'editor_style'  => array_pop( $quiz_block['css'] )['handle'],
				'render_callback' => array( $this, 'render_quiz' ),
			)
		);
	}

    public function register_rest_endpoints() {
        register_rest_route(
			'easyteachlms/v4',
			'/quiz/submit',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_handle_quiz_submission' ),
				'args'                => array(
					'userId'      => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'uuid'        => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'courseId'    => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'newScore'    => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'passingScore'    => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return current_user_can( 'read' );
				},
			)
		);
    }

    public function restfully_handle_quiz_submission( \WP_REST_Request $request ) {
        $user_id       = (int) $request->get_param( 'userId' );
        $course_id     = (int) $request->get_param( 'courseId' );
        $uuid          = $request->get_param( 'uuid' );
        $new_score     = $request->get_param( 'newScore' );
		$passing_score = $request->get_param( 'passingScore' );
        $entry         = $request->get_body();

        $quiz_submission_data = array(
			'action' => 'quiz-submission',
			'courseId' => $course_id,
			'uuid' => $uuid,
            'userId' => $user_id,
			'data' => array(
				'score' => $new_score,
                'entry' => $entry,
			)
        );

        $data = do_action('easyteach_student_action', $quiz_submission_data);
		
		if ( $new_score >= $passing_score ) {
			do_action('easyteach_student_action', array(
				'action' => 'complete',
				'courseId' => $course_id,
				'uuid' => $uuid,
				'userId' => $user_id,
				'data' => array(
					'status' => 'complete'
				)
			));
		}

		return wp_json_encode( $data );
    }
}

new Quiz(true);