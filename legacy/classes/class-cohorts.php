<?php
//TODO: This is an early implementation of Cohorts. It needs fine finishing.
namespace EasyLMS;

class cohorts {
	public $current;

	public function __construct() {

	}

	public function admin_init() {
		// When saving the cohorts options field you should hook in and grab the data and then have a function that runs logic to decide if it should do the create or update function. If there are existing cohorts then run update.
		add_action('acf/save_post', array($this, 'save_logic'), 20);
	}

	protected function define_role() {
		// Define WP role for teachers that gives them a somewhat elevated status to students/subscribers...
	}

	public function save_logic( $id ) {
		if ( 'options' !== $id ) {
			return;
		}
		$data = get_field( 'cohorts', 'options' );
		error_log( print_r($data, true) );
		// there will always be data but you may not have an index because this could be the first time.
		// if there is data and there is an index and in that index is the cohort name then you should do an update. if there is data and there is an index and in that index is
		if ( $data && ! $index ) {
			// Then
		} else {
			// Do update
		}
		error_log("Look Here " . $id);
	}

	protected function assign( $student_id, $cohort_key ) {
		$user_id = get_current_user_id();

		if ( false === get_option( $cohort_key ) ) {
			return new WP_Error( 'easylms_error', __( "A cohort with this key '" . $cohort_key . "' does not exist.", "easylms" ) );
		}

		// Add student to the master cohorts entry.
		$data = get_option( $cohort_key );
		$data['total_students'] = $data['total_students']++;
		$data['students'][] = $student_id;
		update_option( $cohort_key, $data );

		// Add student to total list of students under a teacher
		$data = get_user_meta( $user_id, '_teacher_students', true );
		if ( ! $data ) {
			$data = array( $student_id );
		} elseif ( $data[$student_id] ) {
			$data[] = $student_id;
		}
		update_user_meta( $user_id, '_teacher_students', $data );

		// Add cohort key to index for students.
		$data = get_user_meta( $student_id, '_user_cohorts', true );
		if ( ! $data ) {
			$data = array( $cohort_key );
		} elseif ( $data[$cohort_key] ) {
			$data[] = $cohort_key;
		}
		update_user_meta( $student_id, '_teacher_students', $data );

	}

	public function construct( $user_id = false, $cohort_name ) {
		if ( false === $user_id ) {
			$user_id = get_current_user_id();
		}

		if ( ! $cohort_name ) {
			return false;
		}

		$cohort_key = 'cohort_' . rand();

		$cohort_index = get_option( '_cohort_index' );
		if ( ! $cohort_index ) {
			// Initialize cohort index for the first time
			update_option( '_cohort_index', array( $cohort_key ) );
		} else {
			$cohort_index[] = $cohort_key;
			update_option( '_cohort_index', $cohort_index );
		}

		$data = array(
			'key' => $cohort_key,
			'name' => $cohort_name,
			'total_students' => 0,
			'students' => array(),
			'owner' => $user_id
		);
		update_option( $cohort_key, $data );

		$data = get_user_meta( $user_id, '_teacher_cohorts', true );
		if ( ! $data ) {
			$data = array( $cohort_key );
		} else {
			$data[] = $cohort_key;
		}
		update_user_meta( $user_id, '_teacher_cohorts', $data );

	}

	public function update( $cohort_key, $new_data ) {
		$data = get_option( $cohort_key );
		if ( $new_data['name'] ) {
			$data['name'] = $new_data['name'];
		}

		if ( $new_data['students'] ) {
			$data['students'] = $new_data['students'];
		}

		if ( $new_data['total_students'] ) {
			$data['total_students'] = $new_data['total_students'];
		}

		if ( $new_data['owner'] ) {
			$data['owner'] = $new_data['owner'];
		}
		update_option( $cohort_key, $data );
	}

	public function transfer( $cohort_key, $current_owner_id, $new_owner_id ) {
		$this->update_cohort( $cohort_key, array( 'owner' => $new_owner_id ) );

		// get the students within the cohort and add them to the new owners master student list using assign->student.
	}

	public function get_students_list() {

	}

	public function get_students_progress() {

	}

	protected function build_progress_chart() {
		// https://www.chartjs.org/
		// A free charting library, need to find a good one that we can do the following charts:
		// 1. By course the total number of students as a pie chart of students the pass/fail.
		// 2. By student their courses progress with bar chart.
		// 3. A view by course of the quiz questions in a bar chart that shows each question and the number of responses for each answer.
	}
}

$cohorts = new cohorts();
add_action( 'admin_init', array( $cohorts, 'admin_init' ) );

// $teachers->current = array(
// 	'students' => array(xxx), // student ids
// 	'courses' => array(
// 		'courseid' => array(xxx),
// 		'courseid2' => array(xxx,xxxx,xxxxx),
// 	)
// );
