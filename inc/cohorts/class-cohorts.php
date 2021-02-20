<?php
/**
 * User Tracking Functions, Rest Endpoints, Data Structure.
 *
 * @package EasyTeachLMS
 */

// use BP_Group_Extension;
use EasyTeachLMS\Data_Model;

/**
 * Track user progress and provide analytics for managers on student progress.
 *
 * @package EasyTeachLMS
 */

class Cohorts extends EasyTeachLMS {
	protected static $js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-polyfill', 'wp-i18n', 'wp-dom-ready', 'wp-api-fetch', 'wp-components' );

	/**
	 * Handle class init.
	 *
	 * @param bool $init true to run init false to access class.
	 * @return void
	 */
	public function __construct( $init = false ) {
		if ( true === $init ) {
			require_once EASYTEACHLMS_PATH . '/inc/cohorts/my-groups-widget/index.php';

			add_filter( 'bp_rest_groups_prepare_value', array( $this, 'extend_groups_rest_data' ), 10, 3 );
			add_filter( 'elms_cohort_group_data', array( $this, 'get_courses' ), 10, 2 );
		}
	}

	public function get_group_courses( $group_id ) {
		if ( ! function_exists( 'groups_get_groupmeta' ) ) {
			return false;
		}
		return apply_filters( 'elms_group_courses', groups_get_groupmeta( $group_id, '_attached_courses' ), $group_id );
	}

	public function get_group_members( $group_id ) {
		if ( ! function_exists( 'groups_get_group_members' ) ) {
			return false;
		}
		$members   = groups_get_group_members( array( 'group_id' => $group_id ) );
		$to_return = array();
		foreach ( $members['members'] as $key => $member ) {
			$to_return[] = $member->ID;
		}
		return $to_return;
	}

	public function extend_groups_rest_data( $response, $request, $item ) {
		if ( property_exists( $response, 'data' ) ) {
			$requesting_user = wp_get_current_user();

			$group_id                  = (int) $response->data['id'];
			$response->data['courses'] = $this->get_group_courses( $group_id );
			$response->data['members'] = $this->get_group_members( $group_id );
			$response->data            = apply_filters( 'elms_cohort_group_data', $response->data, $group_id );
		}
		return $response;
	}

	public function get_courses( $data, $group_id ) {
		if ( array_key_exists( 'courses', $data ) ) {
			$data['courseStructure'] = array();
			$data_model              = new Data_Model( false );
			foreach ( $data['courses'] as $course_id ) {
				$data['courseStructure'][ $course_id ] = $data_model->get_course_structure( $course_id, false, get_current_blog_id() );
			}
		}
		return $data;
	}

	// Helper functions for fetching and shaping data.

	public function get_group_tracking_data( $group_id ) {
		$courses = $this->get_group_courses( $group_id );
		error_log( 'get_group_tracking_data' );
		error_log( print_r( $courses, true ) );
		// $group_data['members'] = array();
		// go through each courseId and then construct an array of each member from group_data['members'] and then go get each members data...
	}

	public function mark_uuid_as( $uuid, $action, $data ) {
	}

	public function mark_uuid_complete() {

	}

	public function mark_uuid_started() {

	}

	public function mark_quiz_complete() {

	}

}

new Cohorts( true );
