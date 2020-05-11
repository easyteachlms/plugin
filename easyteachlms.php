<?php
/*
Plugin Name: EasyTeach LMS
Plugin URI: https://easyteachlms.com
Description: An easy to use LMS for WordPress. Supports additional features from WooCommerce, and BBPress.
Version: 5.0
Author: Cliff Michaels & Associates, LLC.
Author URI: http://cliffmichaels.com
GitHub Plugin URI: https://github.com/easyteachlms/plugin
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
	protected $plugin_version   = '5.0.0';
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
	// public function EasyTeachLMS() {
	// 	$this->__construct();
	// }
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
	public function __construct( $init = false ) {
		add_action( 'init', array( $this, 'rewrite' ) );
		add_action( 'init', array( $this, 'rewrite_tags' ) );
		add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
		
		register_activation_hook( EASYTEACHLMS_FILE, array( $this, 'activate' ) );
		register_deactivation_hook( EASYTEACHLMS_FILE, array( $this, 'deactivate' ) );

		$this->include_files();
	}
	/**
	 * Initializes the Base_Plugin() class
	 *
	 * Checks for an existing Base_Plugin() instance
	 * and if it doesn't find one, creates it.
	 *
	 * @uses Base_Plugin()
	 */
	// public function &init() {
	// 	static $instance = false;
	// 	if ( ! $instance ) {
	// 		$instance = new EasyTeachLMS();
	// 	}
	// 	return $instance;
	// }

	public function rewrite_tags() {
	}

	public function rewrite() {
	}

	public function include_files() {
		require_once EASYTEACHLMS_PATH . '/inc/class-course.php';
	}

	public function activate() {
		global $wp_rewrite;
		$wp_rewrite->flush_rules( false );
	}

	public function register_admin_menu() {
		add_menu_page(
			'EasyTeach LMS',
			'EasyTeachLMS',
			'read',
			'easyteach-lms',
			'', // Callback, leave empty
			'dashicons-welcome-learn-more',
			3
		);
	}

	public function deactivate() {

	}

}

// ACF needs to be loaded before the rest of the plugin
require EASYTEACHLMS_PATH . '/vendor/plugin-installs.php';

$EasyTeachLMS = new EasyTeachLMS();
// $EasyTeachLMS->init();

// add_filter(
// 'github_updater_set_options',
// function () {
// return array(
// 'eachteachlms/plugin' => '3f459ae81bb2c0768746fc0309422a0576a15ef1',
// );
// }
// );
