<?php
namespace EasyLMS;

class reports {
	public function __construct() {

	}

	public function admin_init() {
		add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );
	}

	public function scripts() {
		$screen = get_current_screen();
		if ( 'dashboard_page_easy-lms-reports' !== $screen->base ) {
			return;
		}

		$user_id = get_current_user_id();

        wp_enqueue_script( 'wp-api' );

		wp_enqueue_script(
            'easylms-misc',
            BASEPLUGIN_URL . 'assets/js/misc.js',
            array('jquery'),
            null,
            true
        );

		wp_register_script(
            'easylms-reports',
            BASEPLUGIN_URL . 'assets/js/reports.js',
            array('jquery'),
            null,
            true
        );
		wp_localize_script( 'easylms-reports', 'wpUserID', array( 'uid' => $user_id, 'siteURL' => get_bloginfo( 'url' ) ) );
		wp_enqueue_script( 'easylms-reports' );

		wp_enqueue_script(
            'easylms-charts',
            BASEPLUGIN_URL . 'vendor/chart.js/dist/Chart.min.js',
            array('jquery'),
            '2.7.2',
            true
        );

		wp_enqueue_script(
            'easylms-progress',
            BASEPLUGIN_URL . 'vendor/semantic-ui/components/progress.min.js',
            array('jquery'),
            null,
            true
        );
		wp_enqueue_style( 'easylms-admin-progress', plugins_url( '../../vendor/semantic-ui/components/progress.min.css', __FILE__ ), false );

		wp_enqueue_style( 'easylms-admin', plugins_url( '../../assets/css/easylms-admin.css', __FILE__ ), false );
	}

	// Gets a report showing a table with the users enrolled courses and if theyve watched a video, not watched, or completed a video. Also shows if the student has attempted the quiz, how many times theyve attempted, and final grade. Also a quick did he/she pass/fail the course.
	public function get_student_report() {
		// Get a students specific user profile and their passed courses and info.
	}

	public function get_courses() {
		$the_query = new \WP_Query( array(
			'post_type' => 'course',
			'meta_key' => '_students_enrolled'
		) );

		// The Loop
		if ( $the_query->have_posts() ) {
			while ( $the_query->have_posts() ) {
				// ob start, and check for cache and then output otherwise continue and then at the end of the loop store into cache.
				$the_query->the_post();

				$course_id = get_the_ID();
				$students = get_post_meta( $course_id,  '_students_enrolled', true );
				$total_students = count($students);
				////
				$passed_students = get_post_meta( $course_id,  '_students_passed', true );
				if ( ! empty( $passed_students ) ) {
					$passed_students = count($passed_students);
				} else {
					$passed_students = 0;
				}
				////
				$not_passed_students = $total_students - $passed_students;
				////
				$final_grade = get_post_meta( $course_id, '_students_grades', true );

				// Course View... and then we need a students view.
				?>
				<div id="js-course-<?php echo esc_attr( $course_id );?>-report" class="wp-pattern-example" data-course-id="<?php echo esc_attr( $course_id );?>">
					<h3 class="course-title"><a href="<?php the_permalink();?>" target="_blank"><?php the_title();?></a> <span style="float: right;"><small>Total Students: <?php echo $total_students;?></small></span></h3>

					<?php add_thickbox();?>
					<div id="js-message-course-<?php echo $course_id;?>" style="display:none;">
						<p>Send a message to all students enrolled in <strong><?php the_title();?></strong>:</p>
						<form>
							<input type="text" placeholder="Subject">
							<textarea style="width: 100%;" placeholder="Your message to all students enrolled in this course"></textarea>
						</form>
						<button class="button submit">Submit</button>
					</div>
					<p><a href="#TB_inline?width=600&height=550&inlineId=js-message-course-<?php echo $course_id;?>" class="thickbox button">Message Students</a></p>

					<div class="easylms-course-grid-layout">
						<div>
							<table class="wp-pattern-table">
								<thead>
									<tr>
										<th colspan="2"><?php esc_html_e( 'Student' ); ?></th>
										<th><?php esc_html_e( 'Progress' ); ?></th>
									</tr>
								</thead>
								<tbody>
								<?php foreach ($students as $uid) {
								$user = get_userdata($uid);
								?>
									<tr data-student-id="<?php echo esc_attr($uid);?>">
										<td colspan="2">
											<h3><?php echo esc_html_e($user->first_name . ' ' . $user->last_name);?></h3>
											<p><span class="dashicons dashicons-email-alt"></span> <?php echo esc_html_e($user->user_email);?></p>
										</td>
										<td>
											<div class="ui progress chart-progress">
												<div class="bar">
													<div class="progress"></div>
												</div>
											</div>
											<?php if ( isset($final_grade[$uid]) ) {
												echo "<p><strong>Final Grade:</strong> {$final_grade[$uid]}</p>";
											} ?>
										</td>
									</tr>
									<tr>
										<td colspan="3">
											<h4 class="js-reveal-module">Click to view module progress</h4>
											<div class="module-progress" style="display:none;"></div>
										</td>
									</tr>
								<?php } ?>
								</tbody>
							</table>
						</div>
						<div>
							<h4><?php esc_html_e( 'Total Complete/Incomplete' ); ?></h4>
							<canvas id="js-passed-chart-<?php echo rand();?>" class="chart-passed" width="400" height="400"
								data-chart-id="<?php echo esc_attr($course_id);?>"
								data-total-students="<?php echo esc_attr($total_students);?>"
								data-passed-students="<?php echo esc_attr($passed_students);?>"
								data-not-passed-students="<?php echo esc_attr($not_passed_students);?>"
							></canvas>
						</div>
					</div>
				</div>
				<?php
			} // End foreach course.
			/* Restore original Post Data */
			wp_reset_postdata();
		}
	}

}

$reports = new reports();
add_action( 'init', array( $reports, 'admin_init' ) );
