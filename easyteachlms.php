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

// Load WC_AM_Client class if it exists.
if ( ! class_exists( 'WC_AM_Client_2_7' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'wc-am-client.php';
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

define( 'EASYTEACHLMS_VERSION', '5.0.0' );
define( 'EASYTEACHLMS_FILE', $easyteach_lms_file );
define( 'EASYTEACHLMS_PATH', WP_PLUGIN_DIR . '/' . basename( dirname( $easyteach_lms_file ) ) );
define( 'EASYTEACHLMS_VENDOR_PATH', WP_PLUGIN_DIR . '/' . basename( dirname( $easyteach_lms_file ) ) . '/vendor/' );
define( 'EASYTEACHLMS_URL', plugin_dir_url( __FILE__ ) );

// Instantiate WC_AM_Client class object if the WC_AM_Client class is loaded.
if ( class_exists( 'WC_AM_Client_2_7' ) ) {
	/**
	 * This file is only an example that includes a plugin header, and this code used to instantiate the client object. The variable $wcam_lib
	 * can be used to access the public properties from the WC_AM_Client class, but $wcam_lib must have a unique name. To find data saved by
	 * the WC_AM_Client in the options table, search for wc_am_client_{product_id}, so in this example it would be wc_am_client_132967.
	 *
	 * All data here is sent to the WooCommerce API Manager API, except for the $software_title, which is used as a title, and menu label, for
	 * the API Key activation form the client will see.
	 *
	 * ****
	 * NOTE
	 * ****
	 * If $product_id is empty, the customer can manually enter the product_id into a form field on the activation screen.
	 *
	 * @param string $file             Must be __FILE__ from the root plugin file, or theme functions, file locations.
	 * @param int    $product_id       Must match the Product ID number (integer) in the product.
	 * @param string $software_version This product's current software version.
	 * @param string $plugin_or_theme  'plugin' or 'theme'
	 * @param string $api_url          The URL to the site that is running the API Manager. Example: https://www.toddlahman.com/
	 * @param string $software_title   The name, or title, of the product. The title is not sent to the API Manager APIs, but is used for menu titles.
	 *
	 * Example:
	 *
	 * $wcam_lib = new WC_AM_Client_2_7( $file, $product_id, $software_version, $plugin_or_theme, $api_url, $software_title );
	 */

	// Example of empty string product_id.
	// $wcam_lib = new WC_AM_Client_2_7( __FILE__, '', '1.0', 'plugin', 'http://wc/', 'Simple Comments - Simple' );
	// $wcam_lib = new WC_AM_Client_2_7( __FILE__, '', '1.0', 'plugin', 'http://wc/', 'WooCommerce API Manager PHP Library for Plugins and Themes' );

	// Preferred positive integer product_id.
	$wcam_lib = new WC_AM_Client_2_7( EASYTEACHLMS_FILE, 139932, EASYTEACHLMS_VERSION, 'plugin', 'https://easyteachlms.com/', 'EasyTeach LMS' );
}

require_once EASYTEACHLMS_VENDOR_PATH . '/autoload.php';
use tgmpa\tgmpa;
use WPackio\Enqueue;

class EasyTeachLMS {
	protected $plugin_version   = '5.0.0';
	public $wp_version_required = '5.4.0';
	public $wp_version_tested   = '5.4.0';

	/**
	 * @var $name   Variable for Base_Plugin used throughout the plugin
	 */
	protected $name = 'EasyTeachLMS';
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
		$this->__construct( true );
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
	public function __construct( $init = false ) {
		if ( true === $init ) {
			if ( is_object( $wcam_lib ) && $wcam_lib->get_api_key_status( false ) ) {
				// Code to load your plugin or theme here.
				// This code will not run until the API Key is activated.
			}
			add_action( 'init', array( $this, 'semantic_ui_css_loader' ) );
			add_action( 'init', array( $this, 'rewrite' ) );
			add_action( 'init', array( $this, 'rewrite_tags' ) );
			add_filter( 'block_categories', array( $this, 'register_block_category' ), 10, 2 );
			add_action( 'admin_notices', array( $this, 'welcome_admin_notice' ) );

			register_activation_hook( EASYTEACHLMS_FILE, array( $this, 'activate' ) );
			register_deactivation_hook( EASYTEACHLMS_FILE, array( $this, 'deactivate' ) );

			$this->include_files();
		}
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
	// static $instance = false;
	// if ( ! $instance ) {
	// $instance = new EasyTeachLMS();
	// }
	// return $instance;
	// }

	public function rewrite_tags() {
	}

	public function rewrite() {
	}

	public function include_files() {
		require_once EASYTEACHLMS_PATH . '/inc/class-admin.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-course.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-data-model.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-lesson.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-rest-api.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-quiz.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-student.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-topic.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-certificate.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-woocommerce.php';
	}


	public function semantic_ui_css_loader() {
		wp_register_style( 'semantic-ui', '//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css' );
	}

	function register_block_category( $categories, $post ) {
		if ( ! in_array( $post->post_type, array( 'course', 'lesson', 'topic' ) ) ) {
			return $categories;
		}
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'education',
					'title' => __( 'Education', 'easyteachlms' ),
				),
			)
		);
	}

	public function activate() {
		flush_rewrite_rules();
	}

	public function deactivate() {

	}

	public function welcome_admin_notice() {

		/* Check transient, if available display notice */
		if ( ! get_option( 'easyteachlms-welcome' ) ) {
			$link = get_bloginfo( 'wpurl' ) . '/wp-admin/admin.php?page=easyteach-lms-settings';
			?>
			<div class="updated notice is-dismissible">
				<p>Thank you for installing EasyTeach LMS! <strong><a href="<?php echo $link; ?>">Get Started</a></strong>.</p>
			</div>
			<?php
		}
	}

}

require EASYTEACHLMS_PATH . '/vendor/plugin-installs.php';

$easy_teach_lms = new EasyTeachLMS( true );
