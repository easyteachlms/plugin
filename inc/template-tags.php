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

	print_r( $student );
	?>
	<div class="elms card">
		<div class="header">
			<a href="<?php echo esc_url( $permalink ); ?>">
				<?php echo $course->post_title; ?>
			</a>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
