<?php
/*
Plugin Name: EasyTeach LMS
Plugin URI: https://easyteachlms.com
Description: An easy to use LMS for WordPress. Supports additional features from WooCommerce, and BBPress.
Version: 1.0.0
Author: Cliff Michaels & Associates, LLC.
Author URI: http://cliffmichaels.com
GitHub Plugin URI: https://github.com/easyteachlms/plugin
*/

// don't call the file directly
if ( ! defined( 'ABSPATH' ) ) {
	return;
}

// Load WC_AM_Client class if it exists.
// if ( ! class_exists( 'WC_AM_Client_2_7' ) ) {
// require_once plugin_dir_path( __FILE__ ) . 'wc-am-client.php';
// }

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

require_once EASYTEACHLMS_VENDOR_PATH . '/autoload.php';
use tgmpa\tgmpa;
use WPackio\Enqueue;

/**
 * EasyTeach LMS
 *
 * @package
 */
class EasyTeachLMS {
	protected $plugin_version   = '5.0.0';
	public $wp_version_required = '5.4.0';
	public $wp_version_tested   = '5.4.0';

	public function wpack() {
		return new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', EASYTEACHLMS_FILE );
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
			// Load WC_AM_Client class if it exists.
			// $wcam_lib = false;
			// if ( ! class_exists( 'WC_AM_Client_2_7' ) ) {
			// require_once EASYTEACHLMS_PATH . 'wc-am-client.php';
			// } else {
			// Preferred positive integer product_id.
			// $wcam_lib = new WC_AM_Client_2_7( EASYTEACHLMS_FILE, 132967, '1.0.0', 'plugin', 'http://wc/', 'EasyTeach LMS' );
			// }

			// if ( is_object( $wcam_lib ) && $wcam_lib->get_api_key_status( false ) ) {
			// Code to load your plugin or theme here.
			// This code will not run until the API Key is activated.
			// }

			$this->include_files();

			add_action( 'init', array( $this, 'semantic_ui_css_loader' ) );
			add_action( 'init', array( $this, 'rewrite' ) );
			add_action( 'init', array( $this, 'rewrite_tags' ) );
			add_filter( 'block_categories', array( $this, 'register_block_category' ), 10, 2 );
			add_action( 'admin_notices', array( $this, 'welcome_admin_notice' ) );

			add_filter( 'classic_editor_enabled_editors_for_post_type', array( $this, 'force_gutenberg' ), 10, 2 );

			add_action( 'bp_include', array( $this, 'include_buddypress_support' ), 32 );

			register_activation_hook( EASYTEACHLMS_FILE, array( $this, 'activate' ) );
			register_deactivation_hook( EASYTEACHLMS_FILE, array( $this, 'deactivate' ) );
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

	public function force_gutenberg( $editors, $post_type ) {
		error_log( 'force_gutenberg' );
		if ( 'course' === $post_type ) {
			$editors['classic_editor'] = false;
		}
		error_log( print_r( $editors, true ) );
		error_log( print_r( $post_type, true ) );
	}

	public function rewrite_tags() {
	}

	public function rewrite() {
	}

	public function include_files() {
		require_once EASYTEACHLMS_PATH . '/inc/template-tags.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-admin.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-certificate.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-course.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-data-model.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-lesson.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-quiz.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-student.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-certificate.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-woocommerce.php';
		// Mid year code cleanup begins below here:
		require_once EASYTEACHLMS_PATH . '/inc/student-tracking/class-student-tracking.php';
	}


	function include_buddypress_support() {
		require_once EASYTEACHLMS_PATH . '/inc/class-buddypress.php';
	}

	public function semantic_ui_css_loader() {
		wp_register_style( 'semantic-ui', '//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css' );
	}

	function register_block_category( $categories, $post ) {
		if ( ! in_array( $post->post_type, array( 'course', 'lesson' ) ) ) {
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
		if ( ! get_option( 'easyteachlms-welcome-2' ) ) {
			$new_course_link = admin_url( 'post-new.php?post_type=course' );
			$settings_link   = get_bloginfo( 'wpurl' ) . '/wp-admin/admin.php?page=easyteach-lms-settings';
			?>
			<div class="updated notice is-dismissible">
				<h3>Welcome to EasyTeach LMS – The World’s most DYNAMIC and CUSTOMIZABLE Learning Management System designed for WordPress.</h3>
				<p>EasyTeach is also a POWERFUL Content Management System, featuring Gutenberg’s Drag & Drop Editor to save you time and effort at every turn, no matter what kind of look and feel you need to create for your user experience.</p>
				<ul style="padding-left: 15px;list-style: disc;">
					<li>Ready to create your first course? <a href="<?php echo $new_course_link; ?>">Start Here</a></li>
					<li style="opacity: 0.6">Need to set up an EasyTeach WordPress Web Template with Built In Demo Content? <a href="#">START HERE (COMING SOON)</a></li>
					<li>Need instructions or resources for Easy Teach? <a href="<?php echo $settings_link; ?>">Start Here</a></li>
				</ul>
			</div>
			<?php
		}
	}

}

require EASYTEACHLMS_PATH . '/vendor/plugin-installs.php';

$easy_teach_lms = new EasyTeachLMS( true );

function lms_throw_error( $msg ) {
	error_log( print_r( $msg, true ) );
}
