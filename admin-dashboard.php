<?php

function easylms_admin_pages() {
	add_dashboard_page(
		'EasyLMS Reports',
		'Easy LMS Reports',
		'read',
		'easy-lms-reports',
		'easylms_reports_Page'
	);
}
add_action('admin_menu', 'easylms_admin_pages');

function easylms_reports_Page() {
	$reports = new EasyLMS\reports();
?>
<div class="wrap">
	<h2><span class="dashicons dashicons-analytics"></span> EasyLMS Reports</h2>
	<p>*Reports refresh every 30 minutes</p>
	<?php $reports->get_courses();?>
</div>
<?php
}
