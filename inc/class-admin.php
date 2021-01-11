<?php
namespace EasyTeachLMS;

require_once EASYTEACHLMS_VENDOR_PATH . '/autoload.php';
use WPackio\Enqueue;
class Admin {
	protected $js_deps       = array( 'react', 'react-dom', 'wp-element', 'wp-polyfill', 'wp-i18n', 'wp-components', 'wp-api-fetch', 'wp-mediaelement' );
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
		}
	}

	public function admin_page_enqueue( $hook ) {
		if ( $hook != 'easyteachlms_page_easyteach-lms-settings' ) {
			return;
		}
		$enqueue  = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );
		$settings = $this->get_settings();
		error_log( 'Adming Settings?' );
		error_log( print_r( $settings, true ) );
		$assets = $enqueue->enqueue(
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

		$entry_point = array_pop( $assets['js'] );
		wp_localize_script( $entry_point['handle'], 'easyTeachSettings', $settings );
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

	public function sell_courses() {
		$post_type_object = get_post_type_object( 'product' );
		error_log( print_r( $post_type_object, true ) );
		if ( ! $post_type_object ) {
			return;
		}

		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return;
		}

		if ( $post_type_object->_edit_link ) {
			$link = admin_url( 'post-new.php?post_type=product' );
			wp_redirect( $link, '302' );
		}
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
			'Settings & Help',
			'edit_others_posts',
			'easyteach-lms-settings',
			array( $this, 'admin_page' )
		);
		add_submenu_page(
			'easyteach-lms',
			'Sell Courses',
			'Sell Courses',
			'edit_others_posts',
			'easyteach-lms-sell-courses',
			array( $this, 'sell_courses' )
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
					return current_user_can( 'edit_others_posts' );
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
		error_log( 'Get Setting' );
		error_log( print_r( $settings, true ) );

		if ( ! array_key_exists( $setting, $settings ) ) {
			return false;
		}
		return $settings[ $setting ];
	}

	public function get_settings() {
		error_log( 'Get Setting' );
		$settings = get_option(
			'_easyteachlms_settings',
			$this->default_settings
		);
		error_log( print_r( $settings, true ) );
		return $settings;
	}
}

new Admin( true );
