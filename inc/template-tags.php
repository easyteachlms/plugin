<?php

/**
 * Diplays a Semantic UI styled card for a course, checks if currently logged in user has access either through purchase or buddypress group.
 *
 * @param mixed $post_id
 * @return void
 */
function easyteach_course_card( $post_id ) {
	$student = easyteach_get_student( get_current_user_id()); 

	$enrolled = false;
	if ( in_array( $post_id, $student->enrolled ) ) {
		$enrolled = true;
	}

	$course    = get_post( $post_id );
	$permalink = get_permalink( $course );
	$post_thumbnail_id = get_post_thumbnail_id( $post );
	$post_thumbnail = wp_get_attachment_image_src($post_thumbnail_id, 'medium');

	ob_start();
	?>
	<div class="ui card">
		<?php if ( false !== $post_thumbnail  ) {
			echo '<div class="image"><img src="'.$post_thumbnail[0].'"></div>';
		}?>
		<div class="content">
			<a href="<?php echo esc_url( $permalink ); ?>" class="header">
				<?php echo $course->post_title; ?>
			</a>
			<div class="description">
				<?php echo get_the_excerpt( $course );?>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
