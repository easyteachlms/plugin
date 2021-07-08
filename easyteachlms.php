<?php
/*
Plugin Name: EasyTeach LMS
Plugin URI: https://easyteachlms.com
Description: An easy to use LMS for WordPress. Supports additional features from WooCommerce, and BuddyPress.
Version: 4.5.2-beta
Author: Cliff Michaels & Associates, LLC.
Author URI: http://cliffmichaels.com
GitHub Plugin URI: https://github.com/easyteachlms/plugin
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

define( 'EASYTEACHLMS_VERSION', '4.5.2' );
define( 'EASYTEACHLMS_FILE', $easyteach_lms_file );
define( 'EASYTEACHLMS_PATH', WP_PLUGIN_DIR . '/' . basename( dirname( $easyteach_lms_file ) ) );
define( 'EASYTEACHLMS_VENDOR_PATH', WP_PLUGIN_DIR . '/' . basename( dirname( $easyteach_lms_file ) ) . '/vendor/' );
define( 'EASYTEACHLMS_URL', plugin_dir_url( __FILE__ ) );

require_once EASYTEACHLMS_VENDOR_PATH . '/autoload.php';
use WPackio\Enqueue;

/**
 * EasyTeach LMS
 *
 * @package
 */
class EasyTeachLMS {
	protected static $plugin_version   = EASYTEACHLMS_VERSION;
	public $wp_version_required = '5.4.0';
	public $wp_version_tested   = '5.4.0';

	public function wpackio() {
		return new Enqueue( 'easyTeachLMS', 'dist', self::$plugin_version, 'plugin', EASYTEACHLMS_FILE );
	}

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
			$this->include_files();
			add_action( 'bp_include', array( $this, 'include_buddypress_support' ), 32 );

			add_filter( 'classic_editor_enabled_editors_for_post_type', function( $editors, $post_type ) {
				if ( 'course' === $post_type ) {
					$editors['classic_editor'] = false;
				}
				return $editors;
			}, 10, 2 );
			
			add_action( 'init', array( $this, 'rewrite' ) );
			add_action( 'init', array( $this, 'rewrite_tags' ) );
			add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );


			register_activation_hook( EASYTEACHLMS_FILE, array( $this, 'activate' ) );
		}
	}

	public function rewrite_tags() {
	}

	public function rewrite() {
	}

	public function include_files() {
		require_once EASYTEACHLMS_PATH . '/inc/certificate/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/course/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/enrollment/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/ghost-block/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/lesson/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/quiz/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/settings/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/updater/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/woocommerce/index.php';

		require_once EASYTEACHLMS_PATH . '/inc/class-data-model.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-student.php';
		require_once EASYTEACHLMS_PATH . '/inc/template-tags.php';
	}


	function include_buddypress_support() {
		require_once EASYTEACHLMS_PATH . '/inc/buddypress/index.php';
	}

	function register_block_category( $block_categories, $editor_context ) {
		if ( ! empty( $editor_context->post ) ) {
			array_push(
				$block_categories,
				array(
					'slug'  => 'education',
					'title' => __( 'Education', 'easyteachlms' ),
					'icon'  => null,
				)
			);
		}
		return $block_categories;
	}

	public function activate() {
		flush_rewrite_rules();
	}
}

require EASYTEACHLMS_PATH . '/vendor/plugin-installs.php';

$easy_teach_lms = new EasyTeachLMS( true );

if ( ! function_exists( 'classNames' ) ) {
	/**
	 * Port of classNames JS library
	 * Ported from https://github.com/cstro/classnames-php
	 *
	 * The classNames function takes any number of arguments which can be a string or array. When using an array, if the value associated with a given key is falsy, that key won't be included in the output. If no value is given the true is assumed.
	 * classNames('foo'); // 'foo'
	 * classNames(['foo' => true]); // 'foo'
	 * classNames('foo', ['bar' => false, 'baz' => true]); // 'foo baz'
	 * classNames(['foo', 'bar' => true]) // 'foo bar'
	 *
	 * @return string
	 */
	function classNames() {
		$args = func_get_args();

		$data = array_reduce(
			$args,
			function ( $carry, $arg ) {
				if ( is_array( $arg ) ) {
					return array_merge( $carry, $arg );
				}

				$carry[] = $arg;
				return $carry;
			},
			array()
		);

		$classes = array_map(
			function ( $key, $value ) {
				$condition = $value;
				$return    = $key;

				if ( is_int( $key ) ) {
					$condition = null;
					$return    = $value;
				}

				$isArray          = is_array( $return );
				$isObject         = is_object( $return );
				$isStringableType = ! $isArray && ! $isObject;

				$isStringableObject = $isObject && method_exists( $return, '__toString' );

				if ( ! $isStringableType && ! $isStringableObject ) {
					return null;
				}

				if ( $condition === null ) {
					return $return;
				}

				return $condition ? $return : null;

			},
			array_keys( $data ),
			array_values( $data )
		);

		$classes = array_filter( $classes );

		return implode( ' ', $classes );
	}
}