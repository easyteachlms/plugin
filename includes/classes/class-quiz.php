<?php
namespace EasyLMS;

class quiz {

	public $form = array();
	public $questions = array();
	public $answer_key = array();
	public $responses = array();
	public $pass_fail = false;
	public $passed = null;
	public $module_slug = false;

	public function __construct() {
	}

	private function clear_values() {
		$this->form = array();
		$this->answer_key = array();
		$this->questions = array();
		$this->responses = array();
		$this->pass_fail = false;
		$this->passed = false;
	}

	public function object( $post_id, $data = false, $is_module = false ) {
		if ( false === $data && false === $is_module ) {
			$data = get_field( 'quiz', $post_id );
		} elseif( false === $data && true === $is_module  ) {
			$data = json_decode($data);
		}

		if ( empty( $data ) || ! is_array( $data ) ) {
			return false;
		}

		$object = array(
			'course_id' => $post_id,
			'questions' => array(),
			'form' => array(),
			'answer_key' => array(),
		);

		$this->clear_values();

		if ( ! empty( $data ) && is_array( $data ) ) {
			$i = 0;
			foreach ($data as $question) {
				$q = $question['question'];
				$object['questions'][$i] = $q;
				$object['form'][$q] = array();

				if ( $question['answers'] ) {
					foreach ($question['answers'] as $answer) {
						if ( 'true' == $answer['true'] || true === $answer['true'] ) {
							$object['answer_key'][$q] = $answer['answer_text'];
						}
						$object['form'][$q][] = $answer['answer_text'];
					}
				}
				$i++;
			}

			// Send data into the class so other functions can easily access this so long as object( $post_id ) has been called.
			$this->form = $object['form'];
			$this->answer_key = $object['answer_key'];
			$this->questions = $object['questions'];
		}

		$this->pass_fail = get_field( 'passing_grade', $post_id );

		return $object;
	}

	public function is_this_correct( $question, $response ) {
		if ( $response === $this->answer_key[$question] ) {
			return true;
		} else {
			return false;
		}
	}

	public function grade( $responses ) {
		$this->passed = null;

		$correct = array();
		$incorrect = array();

		foreach ($responses as $key => $response) {
			if ( true === $this->is_this_correct( $this->questions[$key], $response ) ) {
				$correct[] = $key;
			} else {
				$incorrect[] = $key;
			}
		}

		$correct = count($correct);
		$incorrect = count($incorrect);
		$total = $correct + $incorrect;
		$percentage = (( $correct / $total ) * 100);
		$percentage = round($percentage, 2);

		if ( $percentage >= $this->pass_fail ) {
			$this->passed = true;
			return $percentage;
		} else {
			$this->passed = false;
			return $percentage;
		}

	}

	// This is a good example API wise of our rest naming $course_structure
	// rest_{endpoint that should also be semantically name}_subsystem/function
	// rest_grade(the endpoint and also the action)_what is being acted on.
	public function rest_grade_quiz( \WP_REST_Request $request ) {
		$course_id = $request->get_param( 'course_id' );
		$module_id = $request->get_param( 'module_id' );
		$answers = $request->get_param( 'answers' );
		$quiz_raw = $request->get_param('quiz_raw');

		if ( ! empty( $module_id ) ) {
			$object = $this->object( $course_id, $quiz_raw );
		} else {
			$object = $this->object($course_id );
		}

		$this->responses = $answers;
		$grade = $this->grade( $this->responses );

		if ( ! empty( $module_id ) && true === $this->passed ) {
			$this->record_passed_modules( $course_id, $module_id, $grade );
		} elseif ( empty( $module_id ) && true === $this->passed ) {
			$this->record_passed_quiz( $course_id, $grade );
		}

		if ( true === $this->did_pass_all_modules( $course_id ) ) {
			$user_id = get_current_user_id();
			$final_quiz_grades = get_user_meta( $user_id, '_passed_quizzes', true );
			$this->record_passed_course( $course_id, $final_quiz_grades[$course_id] );
		}

		// Return if the user passed or not.
		return $this->passed;
	}

	////////////////////////
	//// Course Quiz
	////////////////////////
	public function record_passed_quiz( $passed_course_id, $grade ) {
		$user_id = get_current_user_id();

		// Record on the user
		$data = get_user_meta( $user_id, '_passed_quizzes', true );
		if ( ! $data ) {
			$data = array( $passed_course_id => $grade, );
		} else {
			$data[$passed_course_id] = $grade;
		}
		update_user_meta( $user_id, '_passed_quizzes', $data );

	}

	public function did_pass_quiz( $post_id ) {
		$user_id = get_current_user_id();
		$passed_courses = get_user_meta( $user_id, '_passed_quizzes', true );
		if ( empty( $passed_courses ) ) {
			return false;
		}
		if ( true === array_key_exists( $post_id, $passed_courses ) ) {
			return true;
		} else {
			return false;
		}
	}

	////////////////////////
	//// Module Quizzes
	////////////////////////
	public function record_passed_modules( $passed_course_id, $module_slug, $grade ) {
		$user_id = get_current_user_id();

		// Record on user
		$data = get_user_meta( $user_id, '_modules_passed', true );
		if ( ! $data ) {
			$data = array( $passed_course_id.'-'.$module_slug => $grade, );
		} else {
			$data[$passed_course_id.'-'.$module_slug] = $grade;
		}
		update_user_meta( $user_id, '_modules_passed', $data );

	}

	public function did_pass_module( $post_id, $module_slug ) {
		$user_id = get_current_user_id();
		$passed_modules = get_user_meta( $user_id, '_modules_passed', true );
		if ( empty( $passed_modules ) ) {
			return false;
		}
		if ( true === array_key_exists( $post_id.'-'.$module_slug, $passed_modules ) ) {
			return true;
		} else {
			return false;
		}
	}

	////////////////////////////////
	//// Course Passing Logic
	////////////////////////////////

	/**
	 * Checks if the current user passed all the modules and the final quiz and if so returns true.
	 * @param  [type]  $post_id        [description]
	 * @param  boolean $return_average [description]
	 * @return [type]                  [description]
	 */
	public function did_pass_all_modules( $post_id ) {
		$user_id = get_current_user_id();
		$course_passed = false;
		$module_quizzes = array();

		// Gather all the module quizzes
		$courses = new courses();
		$courseOBJ = $courses->get_course_object( $post_id );
		if ( empty( $courseOBJ['modules'] ) ) {
			return false;
		}

		foreach ($courseOBJ['modules'] as $module_slug) {
			$module_slug = strtolower($module_slug);
			$module_slug = str_replace ( ' ' , '-' , $module_slug );
			if ( true === array_key_exists( 'quiz_raw', $courseOBJ[$module_slug] ) ) {
				$module_quizzes[] = $module_slug;
			}
		}

		foreach ($module_quizzes as $module_slug) {
			$pass_status = $this->did_pass_module( $post_id, $module_slug );
			if ( true !== $pass_status ) {
				return false;
			} else {
				$course_passed = true;
			}
		}
		if ( false == $this->did_pass_quiz( $post_id ) ) {
			return false;
		}

		return $course_passed;
	}

	// Uses the final aggregate grade
	public function record_passed_course( $post_id, $grade ) {
		$user_id = get_current_user_id();

		// Record on the user
		$data = get_user_meta( $user_id, '_passed_courses', true );
		if ( ! $data ) {
			$data = array( $post_id => $grade, );
		} else {
			$data[$post_id] = $grade;
		}
		update_user_meta( $user_id, '_passed_courses', $data );

		// Record students who passed on the course
		$index = get_post_meta( $post_id,  '_students_passed', true );
		if ( ! $index ) {
			$index = array( $user_id );
		} else {
			$index[] = $user_id;
		}
		update_post_meta( $post_id, '_students_passed', $index );

		// Record all grades on the course
		$index = get_post_meta( $post_id,  '_students_grades', true );
		$user_id = get_current_user_id();
		if ( ! $index ) {
			$index = array( $user_id => $grade );
		} else {
			$index[$user_id] = $grade;
		}
		update_post_meta( $post_id, '_students_grades', $index );
	}

	public function did_pass_course( $post_id ) {
		$user_id = get_current_user_id();
		$passed_courses = get_user_meta( $user_id, '_passed_courses', true );
		if ( empty( $passed_courses ) ) {
			return false;
		}
		if ( true === array_key_exists( $post_id, $passed_courses ) ) {
			return true;
		} else {
			return false;
		}
	}

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	public function passed_message( $post_id ) {
		global $wp_query;
		if ( $wp_query->query_vars['moduleSlug'] ) {
			$module_slug = $wp_query->query_vars['moduleSlug'];
		}
		if ( true === $this->did_pass_course( $post_id ) ) {
			echo '<div id="js-quiz-state-message" class="ui positive icon message"><i class="check icon"></i><div class="content"><div class="header">You passed!</div><p>Congratulations, you passed the course!<br><br><a href="#" class="ui button small green" activate-certificate-modal>Download your certificate now</a></p></div></div>';
		} elseif ( true === $this->did_pass_module( $post_id, $module_slug ) ) {
			echo '<div id="js-quiz-state-message" class="ui positive icon message"><i class="check icon"></i><div class="content"><div class="header">You passed!</div><p>Congratulations, you passed the module!</p></div></div>';
		}
	}

	//TODO: this form needs to have a rest endpoint for did_pass like is enrolled. And if you did pass we have a nice congratulations thing and a button to retake the quiz and thus clear your did_pass status for this course. Otherwise display the form. We also need a admin ajax or rest endpoint to send the resposnes data and then grade it and return pass or fail using the semantic form api for filling out logic.
	public function get_form( $post_id, $data = false, $is_module_quiz = "false" ) {
		if ( empty( $this->questions ) || empty( $this->answers ) ) {
			// Init
			$this->object( $post_id, $data );
		}
		wp_enqueue_script('easylms-quiz');
		ob_start();
		echo $this->passed_message( $post_id );
		echo '<div id="js-quiz-form" class="ui form" is-module-quiz="'.esc_attr($is_module_quiz).'">';
		echo '<div class="grouped fields">';
		foreach ($this->form as $question => $answers) {
			echo '<div class="ui segments">';
			echo '<div class="ui secondary segment"><h2 class="ui header">' . $question . '</h2></div>';
			// echo '<label for="' . esc_attr($question) . '"><h2 class="ui header">' . $question . '</h2></label>';
			echo '<div class="ui segment">';
			foreach ($answers as $key => $answer_text) {
				echo '<div class="field"><div class="ui radio checkbox">';
				echo '<input name="' . esc_attr( $question ) . '" value="' . esc_attr( $answer_text ) . '" tabindex="0" class="hidden" type="radio">';
				echo '<label>' . $answer_text . '</label>';
				echo '</div></div>';
			}
			echo '</div>';
			echo '</div>';
		}
		echo '</div>';
		echo '<div class="ui button primary">Submit</div>';
		echo '</div>';
		return ob_get_clean();
	}

}
