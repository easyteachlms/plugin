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
			add_filter( 'elms_cohort_group_data', array( $this, 'get_group_progress' ), 10, 2 );
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

	public function get_member_progress() {
		// Get a list of group members and foreach them.
		$data = array(
			'user_id_01_xxx' => array(
				'course_01_post_id' => array(
					'title' => 'Sample Sales Production Training',
					'data'  => array(
						'lesson_01_uuid' => array(
							'title' => 'Whats new in watch os 7',
							'data'  => array(
								'lesson_content_01_uuid' => array(
									'type'     => 'lesson',
									'title'    => 'First Look: Watch Series 6',
									'complete' => true,
								),
								'lesson_content_02_uuid' => array(
									'type'     => 'lesson',
									'title'    => 'Difference in Watch Series 6 And Beyond',
									'complete' => false,
								),
								'lesson_content_03_uuid' => array(
									'type'     => 'quiz',
									'title'    => 'Difference in Watch Series 6 And Beyond',
									'complete' => true,
									'score'    => 80,
								),
							),
						),
						'lesson_02_uuid' => array(
							'title' => 'Apple Fitness Plus',
							'data'  => array(
								'lesson_content_01_uuid' => array(
									'type'     => 'quiz',
									'title'    => 'Talking to customers about our new watch',
									'complete' => false,
									'score'    => 40,
								),
							),
						),
					),
				),
			),
		);
		return $data;
	}

	/**
	 * Adds course information to the group property in the BP rest api.
	 *
	 * @uses filter->elms_cohort_group_data
	 * @return WP Rest API Response
	 */
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

	public function get_group_progress( $data, $group_id ) {
		if ( array_key_exists( 'courses', $data ) && array_key_exists( 'members', $data ) ) {
			$site_id               = get_current_blog_id();
			$data_model            = new Data_Model( false );
			$data['groupProgress'] = array();

			foreach ( $data['members'] as $user_id ) {
				$data['groupProgress'][ $user_id ] = array();

				foreach ( $data['courses'] as $course_id ) {
					$data['groupProgress'][ $user_id ][ $course_id ] = $data_model->narrowly_parse_course( $course_id, $user_id, $site_id );
				}
			}
		}
		return $data;
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

}

new Cohorts( true );
