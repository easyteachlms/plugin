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
			require_once EASYTEACHLMS_PATH . '/inc/cohorts/widget/index.php';

			add_filter( 'bp_rest_groups_prepare_value', array( $this, 'extend_groups_rest_data' ), 10, 3 );
			add_filter( 'elms_cohort_group_data', array( $this, 'get_group_progress' ), 10, 2 );
		}
	}

	public function get_member_message_link( $user_id ) {
		/**
		 * Filters the URL for the Private Message link in member profile headers.
		 *
		 * @since BuddyPress 1.2.10
		 *
		 * @param string $value URL for the Private Message link in member profile headers.
		 */
		if ( function_exists( 'bp_get_messages_slug' ) ) {
			return apply_filters( 'bp_get_send_private_message_link', wp_nonce_url( bp_loggedin_user_domain() . bp_get_messages_slug() . '/compose/?r=' . bp_core_get_username( $user_id ) ) );
		}
		return null;
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
			$to_return[] = array(
				'name'        => $member->display_name,
				'userId'      => $member->ID,
				'messageLink' => $this->get_member_message_link( $member->ID ),
			);
		}
		return $to_return;
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
			// Check perms?
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

			foreach ( $data['members'] as $user ) {
				$data['groupProgress'][ $user['userId'] ] = array();

				foreach ( $data['courses'] as $course_id ) {
					// $data['groupProgress'][ $user['userId'] ][ $course_id ] = $data_model->narrowly_parse_course( $course_id, $user['userId'], $site_id );
				}
			}
		}
		return $data;
	}

}

new Cohorts( true );
