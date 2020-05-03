<?php
/*
Plugin Name: EasyTeach LMS
Plugin URI: http://easyteachlms.com
Description: An easy to use LMS for WordPress. Supports additional features from WooCommerce, and BBPress.
Version: 4.5.2
Author: Cliff Michaels & Associates, LLC.
Author URI: http://cliffmichaels.com
GitHub Plugin URI: https://github.com/sethrubenstein/easylms
*/

/**
 * Copyright (c) `date "+%Y"` . All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * **********************************************************************
 */

// don't call the file directly
if ( ! defined( 'ABSPATH' ) ) {
	return;
}

$easyteach_lms_file = __FILE__;
/* Find our plugin, wherever it may live! */
if ( isset( $plugin ) ) {
	$easyteach_lms_file = $plugin;
} elseif ( isset( $mu_plugin ) ) {
	$easyteach_lms_file = $mu_plugin;
} elseif ( isset( $network_plugin ) ) {
	$easyteach_lms_file = $network_plugin;
}
define( 'EASYTEACHLMS_FILE', $easyteach_lms_file );
define( 'EASYTEACHLMS_PATH', WP_PLUGIN_DIR . '/' . basename( dirname( $easyteach_lms_file ) ) );
define( 'EASYTEACHLMS_VENDOR_PATH', WP_PLUGIN_DIR . '/' . basename( dirname( $easyteach_lms_file ) ) . '/vendor/' );
define( 'EASYTEACHLMS_URL', plugin_dir_url( __FILE__ ) );

require_once EASYTEACHLMS_VENDOR_PATH . '/autoload.php';
use tgmpa\tgmpa;

class EasyTeachLMS {
	protected $plugin_version   = '4.5.2';
	public $wp_version_required = '4.7';
	public $wp_version_tested   = '5.0.0';

	/**
	 * @var $name   Variable for Base_Plugin used throughout the plugin
	 */
	protected $name = 'EasyLMS';
	/**
	 * @var $nonce_key  A security key used internally by the plugin
	 */
	protected $nonce_key = '+Y|*Ec/-\s3';
	/**
	 * PHP 5.3 and lower compatibility
	 *
	 * @uses Base_Plugin::__construct()
	 */
	public function EasyTeachLMS() {
		$this->__construct();
	}
	/**
	 * Constructor for the Base_Plugin class
	 *
	 * Sets up all the appropriate hooks and actions
	 * within our plugin.
	 *
	 * @uses register_activation_hook()
	 * @uses register_deactivation_hook()
	 * @uses is_admin()
	 * @uses add_action()
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'rewrite' ) );
		add_action( 'init', array( $this, 'rewrite_tags' ) );

		register_activation_hook( EASYTEACHLMS_FILE, array( $this, 'activate' ) );
		register_deactivation_hook( EASYTEACHLMS_FILE, array( $this, 'deactivate' ) );

		$this->include_files();

		add_action( 'widgets_init', array( $this, 'register_widgets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'after_setup_theme', array( $this, 'remove_admin_bar' ) );
		add_filter( 'body_class', array( $this, 'body_class_add_theme' ), 10, 1 );

	}
	/**
	 * Initializes the Base_Plugin() class
	 *
	 * Checks for an existing Base_Plugin() instance
	 * and if it doesn't find one, creates it.
	 *
	 * @uses Base_Plugin()
	 */
	public function &init() {
		static $instance = false;
		if ( ! $instance ) {
			$instance = new EasyTeachLMS();
		}
		return $instance;
	}

	public function rewrite_tags() {
		add_rewrite_tag( '%moduleSlug%', '([^&]+)' );
		add_rewrite_tag( '%itemSlug%', '([^&]+)' );
		add_rewrite_tag( '%userSettings%', '([^&]+)' );
	}

	public function rewrite() {

		add_rewrite_rule(
			'^courses/?',
			'index.php?post_type=course',
			'top'
		);

		// /user/settings
		add_rewrite_rule(
			'^user/dashboard?',
			'index.php?pagename=easylms-user-settings&userSettings=dashboard',
			'top'
		);
		add_rewrite_rule(
			'^user/courses?',
			'index.php?pagename=easylms-user-settings&userSettings=courses',
			'top'
		);
		add_rewrite_rule(
			'^user/settings?',
			'index.php?pagename=easylms-user-settings&userSettings=settings',
			'top'
		);

		 // /course/course-name/module-name/item-name/
		add_rewrite_rule(
			'^course\/([^/]*)\/([^/]*)\/([^/]*)$',
			'index.php?course=$matches[1]&moduleSlug=$matches[2]&itemSlug=$matches[3]',
			'top'
		);

		 // /course/course-name/module-name/
		 // /course/course-name/quiz/
		add_rewrite_rule(
			'^course\/([^/]*)\/([^/]*)$',
			'index.php?course=$matches[1]&moduleSlug=$matches[2]',
			'top'
		);
	}

	public function enqueue() {
		$user_id = get_current_user_id();

		wp_enqueue_script( 'wp-api' );

		wp_enqueue_style(
			'easylms-styles',
			EASYTEACHLMS_URL . 'assets/css/lms.css'
		);

		wp_enqueue_style(
			'easylms-semantic-ui',
			EASYTEACHLMS_URL . 'vendor/semantic-ui/semantic.css'
		);

		wp_enqueue_script(
			'easylms-semanticui',
			EASYTEACHLMS_URL . 'vendor/semantic-ui/semantic.min.js',
			array( 'jquery' ),
			'3.2.1',
			true
		);

		wp_enqueue_script(
			'easylms-pdfgen',
			EASYTEACHLMS_URL . 'vendor/html2pdf/html2pdf.bundle.min.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);

		wp_enqueue_script(
			'easylms-enquirejs',
			EASYTEACHLMS_URL . 'vendor/enquire.min.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);

		wp_enqueue_script(
			'easylms-misc',
			EASYTEACHLMS_URL . 'assets/js/misc.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);

		wp_enqueue_script(
			'easylms-quiz',
			EASYTEACHLMS_URL . 'assets/js/quiz.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);

		wp_enqueue_script(
			'easylms-certificates',
			EASYTEACHLMS_URL . 'assets/js/certificates.js',
			array( 'jquery', 'easylms-pdfgen' ),
			$this->plugin_version,
			true
		);

		wp_enqueue_script(
			'easylms-theme-compat',
			EASYTEACHLMS_URL . 'assets/js/themes.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);

		wp_register_script(
			'easylms-userdata',
			EASYTEACHLMS_URL . 'assets/js/user-data.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);
		wp_localize_script(
			'easylms-userdata',
			'wpUserID',
			array(
				'uid'     => $user_id,
				'siteURL' => get_bloginfo( 'url' ),
			)
		);
		wp_enqueue_script( 'easylms-userdata' );

		wp_register_script(
			'easylms-video-player',
			EASYTEACHLMS_URL . 'assets/js/video-player.js',
			array( 'jquery' ),
			$this->plugin_version,
			true
		);
	}

	public function remove_admin_bar() {
		if ( ! current_user_can( 'administrator' ) && ! is_admin() ) {
			show_admin_bar( false );
		} else {
			show_admin_bar( true );
		}
	}

	public function include_files() {
		// Admin Functions
		require_once EASYTEACHLMS_PATH . '/admin-dashboard.php';

		// Template Tags & Directly Callable Functions
		require_once EASYTEACHLMS_PATH . '/includes/template-tags.php';

		// Classes
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-admin.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-bbpress.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-certificates.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-cohorts.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-courses.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-forms.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-quiz.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-videos.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-user-dashboard.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-rest-api.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-reports.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-woocommerce.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-storefront-compat.php';
		require_once EASYTEACHLMS_PATH . '/includes/classes/class-wp-themes-compat.php';
	}

	public function activate() {
		error_log( 'Activating' );

		if ( ! get_page_by_path( 'easylms-user-settings' ) ) {
			$new_user_settings_page = array(
				'post_title'   => 'Easy Teach LMS User Settings',
				'post_name'    => 'easylms-user-settings',
				'post_status'  => 'publish',
				'post_content' => '[easylms_user_dashboard]',
				'post_type'    => 'page',
			);
			wp_insert_post( $new_user_settings_page );
		}

		global $wp_rewrite;
		$wp_rewrite->flush_rules( false );
	}

	public function register_widgets() {
		register_widget( 'Course_Navigation_Widget' );
		register_widget( 'My_Courses_Widget' );
	}

	public function deactivate() {

	}

	public function body_class_add_theme( $classes ) {
		$theme     = wp_get_theme();
		$classes[] = 'theme-' . $theme->template;
		if ( is_singular( 'course' ) ) {
			$classes[] = 'easylms-active';
		}
		return $classes;
	}

}

// ACF needs to be loaded before the rest of the plugin
require EASYTEACHLMS_PATH . '/vendor/plugin-installs.php';

$EasyTeachLMS = new EasyTeachLMS();
$EasyTeachLMS->init();

// add_filter(
// 'github_updater_set_options',
// function () {
// return array(
// 'easylms' => '3f459ae81bb2c0768746fc0309422a0576a15ef1',
// );
// }
// );
