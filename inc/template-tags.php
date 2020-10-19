<?php

/**
 * Diplays a Semantic UI styled card for a course, checks if currently logged in user has access either through purchase or buddypress group.
 *
 * @param mixed $post_id
 * @return void
 */
function elms_course_card( $post_id ) {
	$user_id = get_current_user_id();
	$student = new EasyTeachLMS\Student( false );
	$student = $student->get_student( $user_id );

	$enrolled = false;
	if ( in_array( $post_id, $student->enrolled ) ) {
		$enrolled = true;
	}

	$course    = get_post( $post_id );
	$permalink = get_permalink( $course );

	ob_start();

	// print_r( $student );
	?>
	<div class="ui card">
		<div class="image">
			<img src="http://easyteach.local/wp-content/uploads/2020/05/rolf-hecken-O0MqTumfxug-1200x800.jpg">
		</div>
		<div class="content">
			<a href="<?php echo esc_url( $permalink ); ?>" class="header">
				<?php echo $course->post_title; ?>
			</a>
			<div class="meta">
				<span class="date"></span>
			</div>
			<div class="description">
			Course Description Here
			</div>
		</div>
		<div class="extra content">
			<a>
			<i class="user icon"></i>
			22 Students
			</a>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
