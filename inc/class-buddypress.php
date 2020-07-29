<?php
namespace EasyTeachLMS;

use WPackio\Enqueue;
use BP_Group_Extension;

if ( class_exists( 'BP_Group_Extension' ) ) {
	class GroupCourses extends BP_Group_Extension {
		protected $js_deps = array( 'react', 'react-dom', 'wp-element', 'wp-polyfill', 'wp-i18n', 'wp-dom-ready', 'wp-api-fetch' );

		/**
		 * Here you can see more customization of the config options
		 */
		public function __construct() {
			$args = array(
				'slug'              => 'easyteach-courses',
				'name'              => 'Courses',
				'nav_item_position' => 10,
				'screens'           => array(
					'edit'   => array(
						'submit_text' => 'Update Courses',
					),
					'create' => array(
						'position' => 10,
					),
				),
			);
			parent::init( $args );

			add_action(
				'init',
				function() {
					error_log( 'BP LMS INIT' );
				}
			);
		}

		public function display( $group_id = null ) {
			$group_id         = bp_get_group_id();
			$attached_courses = groups_get_groupmeta( $group_id, '_attached_courses' );
			$user_id          = 1;
			// Go fetch enrolled courses for this user.
			echo 'Group ID:' . $group_id;
			print_r( $attached_courses );
			echo 'Courses to come here';
		}

		public function settings_screen( $group_id = null ) {
			$attached_courses = groups_get_groupmeta( $group_id, '_attached_courses' );
			error_log( 'settings screen' );
			error_log( print_r( $attached_courses, true ) );
			$value = null;
			if ( ! empty( $attached_courses ) ) {
				$value = implode( ',', $attached_courses );
			}
			$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', EASYTEACHLMS_FILE );
			$enqueue->enqueue(
				'admin',
				'buddyPress',
				array(
					'js'        => true,
					'css'       => true,
					'js_dep'    => $this->js_deps,
					'css_dep'   => array( 'semantic-ui' ),
					'in_footer' => true,
					'media'     => 'all',
				)
			);
			?>
			<h2 class="bp-screen-title">Manage Courses</h2>
			<div id="js-easyteach-courses-field">
				<div id="js-easyteach-courses-field-attach"></div>
				<input type="hidden" name="_attached_courses" value="<?php echo esc_attr( $value ); ?>" />
			</div>
			<?php
		}

		public function settings_screen_save( $group_id = null ) {
			global $_POST;
			$group = groups_get_group( $group_id );
			error_log( $group_id );
			error_log( print_r( $_POST, true ) );
			error_log( print_r( $group, true ) );
			$course_ids = array();
			if ( array_key_exists( '_attached_courses', $_POST ) && ! empty( $_POST['_attached_courses'] ) ) {
				$course_ids = explode( ',', $_POST['_attached_courses'] );
			}
			error_log( 'process:::' );
			error_log( print_r( $course_ids, true ) );
			$this->process_form( $group_id, $course_ids );
		}

		// Link Courses and Groups together through meta.

		public function process_form( $group_id, $course_ids ) {
			// if ( array_key_exists( '_bp_group_edit_nonce_easyteach-courses', $_POST ) && ! wp_verify_nonce( $_POST['_bp_group_edit_nonce_easyteach-courses'] ) ) {
			// @TODO Throw Error
			// lms_throw_error( 'Nonce ' . $_POST['_bp_group_edit_nonce_easyteach-courses'] . ' did not verify' );
			// return false;
			// }
			$attached_courses = groups_get_groupmeta( $group_id, '_attached_courses', true );
			if ( empty( $attached_courses ) ) {
				$attached_courses = array();
			}

			foreach ( $course_ids as $course_id ) {
				if ( ! in_array( $course_id, $attached_courses ) ) {
					$this->add( $group_id, $course_id );
				}
			}

			foreach ( $attached_courses as $course_id ) {
				if ( ! in_array( $course_id, $course_ids ) ) {
					// This $course_id is not in course_ids it has been removed.
					$this->remove( $group_id, $course_id );
				}
			}
		}

		public function add( int $group_id, int $course_id ) {
			error_log( 'Add' );
			$this->attach_course_to_group( $group_id, $course_id );
			$this->attach_group_to_course( $course_id, $group_id );
		}

		public function remove( int $group_id, int $course_id ) {
			error_log( 'Remove' );
			$this->remove_courses_from_group( $group_id, $course_id );
			$this->remove_group_from_course( $course_id, $group_id );
		}

		public function attach_course_to_group( int $group_id, int $course_id, $attached_courses = array() ) {
			error_log( 'attach_courses_to_group' );
			error_log( $group_id );
			error_log( $course_id );
			if ( empty( $attached_courses ) ) {
				$attached_courses = groups_get_groupmeta( $group_id, '_attached_courses', true );
			}
			if ( empty( $attached_courses ) ) {
				$attached_courses = array();
			}
			$attached_courses = array_merge( $attached_courses, array( $course_id ) );
			if ( ! empty( $attached_courses ) ) {
				$members = groups_get_group_members( $group_id );
				error_log( print_r( $members, true ) );
				foreach ( $members as $key => $member ) {
					$user_id = $member[0]->ID;
					error_log( 'UserID:' );
					error_log( print_r( $user_id, true ) );
					// Get group members, if there are members then enroll and loop through each user id.
					$this->enroll( $user_id, $group_id, $attached_courses );
				}
			}
			return groups_update_groupmeta( $group_id, '_attached_courses', $attached_courses );
		}

		public function remove_courses_from_group( int $group_id, int $course_id, $attached_courses = array() ) {
			if ( empty( $attached_courses ) ) {
				$attached_courses = groups_get_groupmeta( $group_id, '_attached_courses', true );
			}
			$attached_courses = array_diff( $attached_courses, array( $course_id ) );
			$members          = groups_get_group_members( $group_id );
			error_log( print_r( $members, true ) );
			foreach ( $members as $key => $member ) {
				$user_id = $member[0]->ID;
				// Get group members, if there are members then unenroll and loop through each user id.
				// $this->unenroll( $user_id, $group_id, $course_ids );
			}

			return groups_update_groupmeta( $group_id, '_attached_courses', $attached_courses );
		}

		public function attach_group_to_course( int $course_id, int $group_id ) {
			$attached_groups = get_post_meta( $course_id, '_attached_groups', true );
			if ( empty( $attached_groups ) ) {
				$attached_groups = array();
			}
			$attached_groups = array_merge( $attached_groups, array( $group_id ) );
			return update_post_meta( $course_id, '_attached_groups', $attached_groups );
		}

		public function remove_group_from_course( int $course_id, int $group_id ) {
			$attached_groups = get_post_meta( $course_id, '_attached_groups', true );
			if ( empty( $attached_groups ) ) {
				$attached_groups = array();
			}
			$attached_groups = array_diff( $attached_groups, array( $group_id ) );
			return update_post_meta( $course_id, '_attached_groups', $attached_groups );
		}

		// Handle user enrollment in group
		public function enroll( $user_id, $group_id, $course_ids = array() ) {
			if ( ! is_int( $user_id ) ) {
				return false;
			}
			error_log( 'group enroll' );
			error_log( $group_id );
			error_log( $user_id );

			if ( empty( $course_ids ) ) {
				$course_ids = groups_get_groupmeta( $group_id, '_attached_courses', true );
			}
			error_log( print_r( $course_ids, true ) );
			if ( ! empty( $course_ids ) ) {
				foreach ( $course_ids as $course_id ) {
					do_action( 'enroll_user', $user_id, $course_id );
				}
			}
		}

		public function unenroll( $user_id, $group_id, $course_ids = array() ) {
			if ( ! is_int( $user_id ) ) {
				return false;
			}
			if ( empty( $course_ids ) ) {
				$course_ids = groups_get_groupmeta( $group_id, '_attached_courses', true );
			}
			if ( ! empty( $course_ids ) ) {
				foreach ( $course_ids as $course_id ) {
					do_action( 'unenroll_user', $user_id, $course_id );
				}
			}
		}

		/**
		 * Gets the UUID's of all lessons, files, quizzes?? in a course by pasrsing the data model.
		 *
		 * @param mixed $course_id
		 * @return array of uuids
		 */
		public function get_uuids( $course_id ) {

		}


		public function update_lessons() {

		}

	}

	bp_register_group_extension( 'EasyTeachLMS\GroupCourses' );

	$group_courses = new GroupCourses();
	add_action( 'groups_membership_accepted', array( $group_courses, 'enroll' ), 10, 2 );
	add_action( 'groups_accept_invite', array( $group_courses, 'enroll' ), 10, 2 );
	add_action( 'bp_groups_member_after_delete', array( $group_courses, 'unenroll' ), 10, 2 );
}
