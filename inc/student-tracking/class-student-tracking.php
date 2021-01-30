<?php
/**
 * User Tracking Functions, Rest Endpoints, Data Structure.
 *
 * @package EasyTeachLMS
 */

use BP_Group_Extension;

/**
 * Track user progress and provide analytics for managers on student progress.
 *
 * @package EasyTeachLMS
 */

class Student_Tracking extends EasyTeachLMS {
	protected static $js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-polyfill', 'wp-i18n', 'wp-dom-ready', 'wp-api-fetch', 'wp-components' );

	/**
	 * Handle class init.
	 *
	 * @param bool $init true to run init false to access class.
	 * @return void
	 */
	public function __construct( $init = false ) {
		if ( true === $init ) {
			require_once EASYTEACHLMS_PATH . '/inc/student-tracking/groups-at-a-glance/index.php';
		}
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

new Student_Tracking( true );
