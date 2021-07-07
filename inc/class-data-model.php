<?php
/**
 * Course structure should be added as post meta to the course.
 * Whenever a lesson is added to a course the lesson should have post meta that lists the ids of the courses where it can be found.
 */
class Data_Model extends EasyTeachLMS {
	protected $course_id = false;
	protected $user_id   = false;
	protected $site_id   = false;
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
			/**
			 * Example how to get the course structure using php.
			 * apply_filters('easyteach_get_course_structure',  int $course_id = 0, $user_id = false, $site_id = false);
			 */
			add_filter( 'easyteach_get_course_structure', array($this, 'get_course_structure'), 10, 4);
		}
	}

	public function register_rest_endpoint() {
		register_rest_route(
			'easyteachlms/v4',
			'/course/get',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_course_structure_restfully' ),
				'args'                => array(
					'courseId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'userId'   => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
					'includeContent'   => array(
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

	public function recursively_search_for_blocks( $array, $key, $value ) {
		$results = array();

		if ( is_array( $array ) ) {

			if ( isset( $array[ $key ] ) && $array[ $key ] == $value ) {
				$results[] = $array;
			}

			foreach ( $array as $subarray ) {
				$results = array_merge( $results, $this->recursively_search_for_blocks( $subarray, $key, $value ) );
			}
		}

		return $results;
	}

	public function has_innerBlocks( $block ) {
		if ( array_key_exists( 'innerBlocks', $block ) ) {
			return true;
		} else {
			return false;
		}
	}

	public function get_block_name( $block_name ) {
		return str_replace( 'easyteachlms/', '', $block_name );
	}

	/**
	 * Sanity check, is the block given the block expected?
	 *
	 * @param mixed $block_name
	 * @param mixed $block
	 * @return bool
	 */
	public function is_block( $block_name, $block ) {
		if ( is_array( $block_name ) ) {
			if ( in_array( $block['blockName'], $block_name, true ) ) {
				return true;
			} else {
				return false;
			}
		} else {
			if ( $block_name === $block['blockName'] ) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**a
	 * Check if a block should be locked because it has a scheduled date in the future.
	 * @param mixed $attributes 
	 * @return bool 
	 */
	public function is_locked($attributes) {
		if ( ! array_key_exists('schedule', $attributes) ) {
			return false;
		}
		$scheduled_date = new DateTime($attributes['schedule']);
		$current_date = new DateTime();
		// If scheduled date is in the past or right now then return true.
		return $current_date <= $scheduled_date;
	}

	// public function is_complete( $uuid, $course_id, $user_id, $site_id ) {
	// 	if ( function_exists( 'switch_to_blog' ) ) {
	// 		switch_to_blog( $site_id );
	// 	}
	// 	$meta_key      = "_course_{$course_id}_{$site_id}";
	// 	$user_progress = get_user_meta( $user_id, $meta_key, true );
	// 	if ( function_exists( 'restore_current_blog' ) ) {
	// 		restore_current_blog();
	// 	}
	// 	if ( is_array( $user_progress ) && array_key_exists( 'completed', $user_progress ) && in_array( $uuid, $user_progress['completed'] ) ) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	public function get_course_structure_restfully( \WP_REST_Request $request ) {
		return $this->get_course_structure(
			$request->get_param( 'courseId' ),
			$request->get_param( 'userId' ),
			get_current_blog_id(),
			'true' === $request->get_param('includeContent'),
		);
	}

	/**
	 * @TODO Look into caching this for a 7 * DAYS_IN_HOURS, on post update we should bust the cache here
	 * @param int $post_id
	 * @return false|array
	 */
	public function get_course_structure( int $course_id = 0, $user_id = false, $site_id = false, $include_content = false ) {
		$post = get_post( $course_id );
		if ( false === $post || null === $post || \is_wp_error( $post ) || ! is_object( $post ) || ! property_exists( $post, 'post_content' ) ) {
			return new WP_Error( 'fetch-error', __( 'API could not find course with id of ' . $course_id.'.', 'easyteachlms' ) );
		}

		if ( !has_block('easyteachlms/course', $post->post_content) ) {
			return new WP_Error( 'course-error', __( 'API did not find easyteachlms/course block in course '.$course_id.' content.', 'easyteachlms' ) );
		}

		$parsed = \parse_blocks( $post->post_content );

		if ( empty( $parsed ) ) {
			return new WP_Error( 'parse-error', __( 'API could not parse course ' .$course_id.'.', 'easyteachlms' ) );
		}

		// @TODO what is the best way to search for and get the first easyteachlms/course block that can be found, regardless of how nested it is. 
		$course  = $this->recursively_search_for_blocks( $parsed, 'blockName', 'easyteachlms/course' );		
		$course  = array_pop( $course );

		$files = $this->recursively_search_for_blocks( $parsed, 'blockName', 'core/file' );
		$files = $this->parse_files( $files );

		$description = array_key_exists( 'description', $course['attrs'] ) ? $course['attrs']['description'] : false;

		$outline = $this->parse_course_block( $course, $course_id, $user_id, $site_id, $include_content );

		return array(
			'id'          => $post->ID,
			'title'       => $post->post_title,
			'permalink'   => get_permalink( $post->ID ),
			'excerpt'     => $post->post_excerpt,
			'description' => $description,
			'scoring' => array(
				'totalPointsAvailable' => 0, // Gather up all the points on quizzes,
				'requiredToPass' => 0, // Get the required to pass from certificate, otherwise calculate 80% of the total points available. 
			),
			'outline'     => $outline,
			'files'       => $files, // Gather up all the files
		);
	}

	protected function parse_course_block( $course, $course_id, $user_id, $site_id, $include_innerblocks ) {
		if ( true !== $this->has_innerBlocks( $course ) ) {
			return new WP_Error( 'parse-error', __( 'API could not find any innerBlocks', 'easyteachlms' ) );
		}

		$outline = array(
			'structured' => array(),
			'flat'       => array(),
			'total'      => 0, // Get total lesson contents and quizzes to do. 
		);

		foreach ( $course['innerBlocks'] as $key => $block ) {
			$next_block = array_key_exists($key+1, $course['innerBlocks']) ? $course['innerBlocks'][$key+1] : false;
			if ( $this->is_block( 'easyteachlms/lesson', $block ) ) {
				// Setup Lesson Block:
				$lesson_uuid   = $block['attrs']['uuid'];
				$lesson_title  = $block['attrs']['title'];
				$lesson_parsed = $this->parse( 'easyteachlms/lesson', $block, $next_block );
				$lesson_contents = array();

				// Parse innerBlocks of lesson (content and quizzes)
				if ( true === $this->has_innerBlocks( $block ) ) {
					foreach ( $block['innerBlocks'] as $key => $block ) {

						if ( 'easyteachlms/quiz' === $block['blockName'] ) {
							$block_parsed = $this->parse_quiz( $block, $course_id, $user_id, $site_id );
						} else {
							$block_parsed = $this->parse( 'easyteachlms/lesson-content', $block );
							if ( array_key_exists('innerBlocks', $block) && $include_innerblocks ) {
								$block_parsed['innerBlocks'] = $block['innerBlocks'];
							}
						}

						if ( true === $block_parsed['active'] ) {
							$lsson_parsed['active'] = true;
						}

						$block_parsed['parentTitle'] = $lesson_title;
						$block_parsed['parentUuid']  = $lesson_uuid;
						
						$lesson_contents[] = $block_parsed;
					}
				}

				// Add all the parsed data into the outline.
				$outline['structured'][ $lesson_uuid ] = $lesson_parsed;
				$outline['flat'][]                     = $lesson_parsed;
				foreach ($lesson_contents as $lesson_content) {
					$outline['flat'][] = $lesson_content;
					$outline['structured'][ $lesson_content['parentUuid'] ]['outline'][ $lesson_content['uuid'] ] = $lesson_content;
				}
			}
		}

		return $outline;
	}

	/**
	 * Parses internal block structure and extracts common elements like title and ID
	 *
	 * @param mixed $block_name
	 * @param mixed $block
	 * @param mixed $key
	 * @param mixed $outline
	 * @return void
	 */
	public function parse( $block_name, $block, $next_block = false ) {
		if ( true !== $this->is_block( $block_name, $block ) ) {
			return;
		}
		
		if ( is_array( $block_name ) ) {
			$block_name = $block_name[ array_search( $block['blockName'], $block_name ) ];
		}

		$uuid = $block['attrs']['uuid'];
		$data = array(
			'parentTitle'   => false,
			'parentUuid'    => false,
			'title'         => $block['attrs']['title'],
			'uuid'          => $uuid,
			'type'          => $this->get_block_name( ( $block['blockName'] ) ),
			'active'        => false,
			'locked'        => $this->is_locked($block['attrs']),
			'requiresPassing' => array_key_exists('requiresPassing', $block['attrs']) && !empty($block['attrs']['requiresPassing']) ? $block['attrs']['requiresPassing'] : false,
		);

		return $data;
	}

	public function parse_files( $blocks ) {
		$return = array();
		foreach ( $blocks as $file ) {
			$return[] = array(
				'title' => get_the_title( $file['attrs']['id'] ),
				'href'  => $file['attrs']['href'],
			);
		}
		return $return;
	}

	public function parse_quiz( $quiz, $course_id, $user_id, $site_id ) {
		$return = array();
		$uuid   = $quiz['attrs']['uuid'];

		$title = $quiz['attrs']['title'];
		if ( empty( $title ) ) {
			$title = 'Quiz';
		}

		if ( ! array_key_exists( 'pointsRequiredToPass', $quiz['attrs'] ) ) {
			$points_required_to_pass = 100;
		} else {
			$points_required_to_pass = $quiz['attrs']['pointsRequiredToPass'];
		}

		$return = array(
			'parentTitle'          => false,
			'parentUuid'           => false,
			'type'                 => 'quiz',
			'title'                => $title,
			'uuid'                 => $uuid,
			'active'               => false,
			'pointsRequiredToPass' => $points_required_to_pass,
			'questions'            => array(),
		);

		$questions = $quiz['innerBlocks'];
		foreach ( $questions as $question ) {
			// Parse the provided question args against defaults.
			$args = wp_parse_args(
				$question['attrs'],
				array(
					'question'    => '',
					'type'        => 'text',
					'answersType' => 'single',
					'explanation' => '',
					'points'      => 10,
				)
			);

			$answers = array();
			if ( 'multiple' === $args['answersType'] ) {
				$correct_answer = array();
			} else {
				$correct_answer = false;
			}
			foreach ( $question['innerBlocks'] as $index => $answer ) {
				$answers[] = $answer['attrs']['answer'];
				if ( array_key_exists( 'isCorrect', $answer['attrs'] ) && true === $answer['attrs']['isCorrect'] ) {
					if ( 'multiple' === $args['answersType'] ) {
						$correct_answer[] = $index++;
					} else {
						$correct_answer = array( $index );
					}
				}
			}

			$args['answers']       = $answers;
			$args['correctAnswer'] = $correct_answer;

			// Construct question.
			$return['questions'][] = array(
				'question'            => $args['question'],
				'answerSelectionType' => $args['answersType'],
				'answers'             => $args['answers'],
				'correctAnswer'       => $args['correctAnswer'],
				'explanation'         => $args['explanation'],
				'points'              => $args['points'],
			);
		}

		return $return;
	}
}

new Data_Model( true );
