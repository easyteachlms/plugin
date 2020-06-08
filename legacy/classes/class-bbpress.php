<?php
namespace EasyLMS;

class BBPress {

	public function __construct() {

	}
	public function init() {
		// Rewrites
		add_action( 'init', array( $this, 'rewrite' ), 10 );
	}
	public function rewrite() {
		// /forums/forum/forum-name/module-name/item-name
		add_rewrite_rule(
			'^forums\/forum\/([^/]*)\/([^/]*)\/([^/]*)$',
			'index.php?forum=$matches[1]&moduleSlug=$matches[2]&itemSlug=$matches[3]',
			'top'
		);

		// /forums/forum/forum-name/module-name/
		// /forums/forum/forum-name/quiz
		add_rewrite_rule(
			'^forums\/forum\/([^/]*)\/([^/]*)$',
			'index.php?forum=$matches[1]&moduleSlug=$matches[2]',
			'top'
		);
	}
}

$bbpress = new BBPress();
$bbpress->init();
