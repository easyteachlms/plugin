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
					'essayAnswer' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
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
        $site_id      = get_current_blog_id();

        $user_id      = (int) $request->get_param( 'userId' );
        $course_id    = (int) $request->get_param( 'courseId' );
        $uuid         = $request->get_param( 'uuid' );
        $new_score    = $request->get_param( 'newScore' );
        $essay_answer = $request->get_param( 'essayAnswer' );

        $meta_key = "_course_{$course_id}_{$site_id}";

        if ( null !== $new_score ) {
            $user_data = get_user_meta( $user_id, $meta_key, true );
            if ( is_array( $user_data ) && array_key_exists( 'scores', $user_data ) && array_key_exists( $uuid, $user_data['scores'] ) ) {
                $user_data = $user_data['scores'][ $uuid ];
            } else {
                return new WP_Error( 'quiz-score-issue', 'Could not correctly ascertain the user data to update quiz score.' );
            }
            $user_data['score'] = $new_score;
        } else {
            $user_data = json_decode( $request->get_body(), true );
        }

        error_log( 'update_quiz_progress_restfully!!' );
        error_log( print_r( $user_data, true ) );

        if ( ! array_key_exists( 'score', $user_data ) && ! array_key_exists( 'total', $user_data ) && ! array_key_exists( 'pointsRequiredToPass', $user_data ) ) {
            return false;
        }

        $data = get_user_meta( $user_id, $meta_key, true );
        if ( ! is_array( $data ) ) {
            $data = array(
                'completed' => array(),
                'scores'    => array(),
            );
        }

        $passed = $user_data['score'] >= $user_data['pointsRequiredToPass'];

        if ( true === $passed ) {
            $data['completed'][] = $uuid;
        } elseif ( array_key_exists( 'completed', $data ) && in_array( $uuid, $data['completed'] ) ) {
            // If the user has already completed/passed this quiz but then submits another entry that fails then the completion should be removed, so find the diff between an array with all the completed and one with this completed item and return that.
            $data['completed'] = array_diff( $data['completed'], array( $uuid ) );
        }

        // If we're passing in an essay answer index then we need to set it as graded.
        if ( null !== $essay_answer ) {
            $user_data['essayAnswers'][ $essay_answer ]['graded'] = true;
        }

        $data['scores'][ $uuid ] = $user_data;

        error_log( $user_id );
        error_log( $meta_key );
        error_log( print_r( $data, true ) );
        error_log('---');

        $updated = update_user_meta( (int) $user_id, $meta_key, $data );
        if ( false !== $updated ) {
            return $data['scores'][ $uuid ];
        } else {
            return new WP_Error( 'quiz-submission-issue', 'Could not update user meta and finish scoring ' . $user_id . ' quiz submission.' );
        }
    }
}

new Quiz(true);