<?php
/*
Plugin Name: EasyTeach LMS
Plugin URI: https://easyteachlms.com
Description: An easy to use LMS for WordPress. Supports additional features from WooCommerce, and BuddyPress.
Version: 4.5.1-beta
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

define( 'EASYTEACHLMS_VERSION', '4.5.1' );
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
	protected static $plugin_version   = '4.5.1';
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
		
		require_once EASYTEACHLMS_PATH . '/inc/certificate/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/cohorts/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/course/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/ghost-block/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/lesson/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/quiz/index.php';
		require_once EASYTEACHLMS_PATH . '/inc/updater/index.php';

		require_once EASYTEACHLMS_PATH . '/inc/template-tags.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-admin.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-data-model.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-enrollment.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-student.php';
		require_once EASYTEACHLMS_PATH . '/inc/class-woocommerce.php';
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

	public function welcome_admin_notice() {
		if ( ! get_option( 'easyteachlms-welcome-' . EASYTEACHLMS_VERSION ) ) {
			$new_course_link = admin_url( 'post-new.php?post_type=course' );
			$settings_link   = get_bloginfo( 'wpurl' ) . '/wp-admin/admin.php?page=easyteach-lms-settings';
			?>
			<div class="updated notice is-dismissible">
				<h3>Welcome to EasyTeach LMS – The World’s most DYNAMIC and CUSTOMIZABLE Learning Management System designed for WordPress.</h3>
				<p>EasyTeach is also a POWERFUL Content Management System, featuring Gutenberg’s Drag & Drop Editor to save you time and effort at every turn, no matter what kind of look and feel you need to create for your user experience.</p>
				<ul style="padding-left: 15px;list-style: disc;">
					<li>Ready to create your first course? <a href="<?php echo $new_course_link; ?>">Start Here</a></li>
					<li>Ready to enable BuddyPress functionality and manage a group of students? <a href="<?php echo $settings_link; ?>">Start Here</li>
					<li>Need instructions or resources for Easy Teach? <a href="<?php echo $settings_link; ?>">Start Here</a></li>
				</ul>
			</div>
			<?php
		}
	}
}

require EASYTEACHLMS_PATH . '/vendor/plugin-installs.php';

$easy_teach_lms = new EasyTeachLMS( true );