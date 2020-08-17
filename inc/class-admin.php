<?php
namespace EasyTeachLMS;

require_once EASYTEACHLMS_VENDOR_PATH . '/autoload.php';
use WPackio\Enqueue;
class Admin {
	protected $js_deps       = array( 'react', 'react-dom', 'wp-element', 'wp-polyfill', 'wp-i18n', 'wp-components', 'wp-api-fetch' );
	public $default_settings = array(
		'openEnrollment' => true,
	);
	// Register Teacher role
	// Register Student role
	// Cohorts?
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_page_enqueue' ) );
			add_action( 'rest_api_init', array( $this, 'rest_routes' ) );
			add_action( 'admin_footer', array( $this, 'settings_json' ) );
			add_action( 'wp_footer', array( $this, 'settings_json' ) );
		}
	}
	public function admin_page_enqueue( $hook ) {
		if ( $hook != 'easyteachlms_page_easyteach-lms-settings' ) {
			return;
		}
		$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );
		$enqueue->enqueue(
			'admin',
			'settings',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $this->js_deps,
				'css_dep'   => array( 'wp-components' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
	}

	public function admin_page() {
		?>
		<div id="easyteachlms-settings"></div>
		<style>
		.components-guide__footer {
			padding: 0 !important;
		}
		</style>
		<?php
	}

	public function register_admin_menu() {
		add_menu_page(
			'EasyTeach LMS',
			'EasyTeachLMS',
			'edit_others_posts',
			'easyteach-lms',
			null,
			'dashicons-welcome-learn-more',
			3
		);
		add_submenu_page(
			'easyteach-lms',
			'EasyTeach LMS Settings',
			'Settings',
			'edit_others_posts',
			'easyteach-lms-settings',
			array( $this, 'admin_page' )
		);
	}

	public function rest_routes() {
		register_rest_route(
			'easyteachlms/v3',
			'/settings/update',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_update_setting' ),
				'args'                => array(
					'setting' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return current_user_can( 'edit' );
				},
			)
		);
	}

	public function restfully_update_setting( \WP_REST_Request $request ) {
		$setting = $request->get_param( 'setting' );
		$value   = json_decode( $request->get_body(), true );
		error_log( 'rest' );
		error_log( $setting );
		if ( ! empty( $setting ) ) {
			error_log( (bool) $value['value'] );
			return $this->update_setting( $setting, $value['value'] );
		} else {
			return false;
		}
	}

	public function update_setting( $setting, $value ) {
		$settings = get_option(
			'_easyteachlms_settings',
			$this->default_settings
		);
		error_log( 'update_setting' );
		error_log( print_r( $settings, true ) );
		error_log( print_r( $setting, true ) );
		error_log( print_r( $value, true ) );
		if ( ! array_key_exists( $setting, $settings ) ) {
			return false;
		}
		$settings[ $setting ] = $value;
		return update_option( '_easyteachlms_settings', $settings );
	}

	public function get_setting( $setting ) {
		$settings = get_option(
			'_easyteachlms_settings',
			$this->default_settings
		);
		if ( ! array_key_exists( $setting, $settings ) ) {
			return false;
		}
		return $settings[ $setting ];
	}

	public function get_settings() {
		return get_option(
			'_easyteachlms_settings',
			$this->default_settings
		);
	}

	public function settings_json() {
		$settings = wp_json_encode( $this->get_settings() );
		echo "<script>const easyTeachSettings = {$settings}</script>";
	}
}

new Admin( true );
