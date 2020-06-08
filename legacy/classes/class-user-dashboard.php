<?php
namespace EasyLMS;

class user_dashboard {
	public $active_tab = false;
	public $current_user = false;
	public $my_courses = false;

	public function __construct() {

	}

	public function dashboard() {
		ob_start();
		$forms = new forms();
		$courses = new courses();
		$theme_compat = new \theme_compat();

		if ( false == $theme_compat->theme_supports('user_dashboard') ) {
			do_action('easylms_user_dashboard_header');
			$menu = array(
				'dashboard' => 'Dashboard',
				'courses' => 'My Courses',
				'settings' => 'Settings',
			);
			echo '<div class="ui tabular menu">';
			foreach ($menu as $key => $value) {
				if ( $this->active_tab === $key ) {
					echo '<a class="item active">' . $value . '</a>';
				} else {
					echo '<a href="' . get_bloginfo('url') . '/user/'. $key . '" class="item">' . $value . '</a>';
				}
			}
			echo '</div>';
		}

		if ( 'dashboard' === $this->active_tab && false !== $this->my_courses ) {
			echo '<div class="ui header">Recent Courses</div>';
			echo '<div class="ui cards easylms-my-courses-list ">';
			$i = 1;
			foreach ($this->my_courses as $course_id) {
				if ( $i <= 4 ) {
					echo $theme_compat->get_course_card( $course_id, true, false );
				}
				$i++;
			}
			echo '</div>';
			echo '<div class="ui header">Course Downloads</div>';
			?>
			<table class="ui celled striped table">
				<thead>
					<tr><th colspan="2">Course</th><th colspan="3">Filename</th></tr>
				</thead>
				<tbody>
					<?php
					foreach ($this->my_courses as $course_id) {
						$courseOBJ = $courses->get_course_object($course_id);
						if ( ! empty( $courseOBJ['downloads'] ) ) {
							foreach ($courseOBJ['downloads'] as $key => $value) {
								$icon = 'file alternate';
								if ( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' === $value->mime_type ) {
									$icon = 'file word';
								} elseif ( 'application/pdf' === $value->mime_type ) {
									$icon = 'file pdf';
								}
								echo '<tr><td class="collapsing" colspan="2">Course Title</td><td colspan="2"><a href="' . $value->url . '" download><i class="'.$icon.' icon"></i>' . $value->title . '</a></td><td class="collapsing" colspan="1"><a href="' . $value->url . '" download class="ui tiny button"><i class="download icon"></i> Download</a></td></tr>';
							}
						}
					}
					?>
				</tbody>
			</table>
			<?php
		} elseif( 'courses' === $this->active_tab ) {
			echo '<div class="ui cards easylms-my-courses-list ">';
			foreach ($this->my_courses as $course_id) {
				echo $theme_compat->get_course_card( $course_id, true, false );
			}
			echo '</div>';
		} elseif( 'settings' === $this->active_tab ) {
			echo '<div class="ui segment">';
			$forms->user_details();
			echo '</div>';

			echo '<div class="ui segment">';
			$forms->change_password();
			echo '</div>';
		} else {
			echo '<a href="'.get_bloginfo( 'url' ).'/courses" class="ui large button">Enroll in Courses</a>';
		}
		do_action('easylms_user_dashboard_footer');
		return ob_get_clean();
	}

	public function dashboard_shortcode() {
		global $wp_query;
		if ( array_key_exists( 'userSettings', $wp_query->query_vars ) ) {
			$this->active_tab = $wp_query->query_vars['userSettings'];
		}
		if ( is_user_logged_in() ) {
			$this->current_user = wp_get_current_user();
			if ( get_user_meta( $this->current_user->data->ID, '_enrolled_courses', true ) ) {
				$this->my_courses = get_user_meta( $this->current_user->data->ID, '_enrolled_courses', true );
			}
		}
		$forms = new forms();

		ob_start();
		if ( false == $this->current_user ) {
			echo $forms->login();
			echo $forms->registration();
		} else {
			echo $this->dashboard();
		}
		return ob_get_clean();
	}

}

$user_dashboard = new user_dashboard();
add_shortcode( 'easylms_user_dashboard', array( $user_dashboard, 'dashboard_shortcode' ) );
