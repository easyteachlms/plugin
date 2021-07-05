<?php

class Settings extends EasyTeachLMS {
	public $default_settings = array(
		'openEnrollment' => true,
	);
	
	// Register Teacher role
	// Register Student role
	// Cohorts?
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'admin_notices', array( $this, 'welcome_admin_notice' ) );
			add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_page_enqueue' ) );
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
		}
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

	public function admin_page_enqueue( $hook ) {
		if ( $hook != 'easyteachlms_page_easyteach-lms-settings' ) {
			return;
		}
		$enqueue = parent::wpackio();
		$settings = $this->get_settings();
		
		$assets = $enqueue->enqueue(
			'wpAdmin',
			'settings',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array( 'wp-mediaelement' ),
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

	public function create_cohort() {
		// $link = get_bloginfo( 'url' ) . '/groups/create/';
		$link = menu_page_url( 'bp-groups' );
		wp_redirect( $link, '302' );
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
			'Sell Courses',
			'Sell Courses',
			'edit_others_posts',
			'easyteach-lms-sell-courses',
			array( $this, 'sell_courses' )
		);
		if ( function_exists( 'groups_get_groupmeta' ) ) {
			add_submenu_page(
				'easyteach-lms',
				'Create Cohort Group',
				'Create Cohort Group',
				'edit_others_posts',
				'easyteach-lms-create-cohort',
				array( $this, 'create_cohort' )
			);
		}
		add_submenu_page(
			'easyteach-lms',
			'EasyTeach LMS Settings',
			'Settings & Help',
			'edit_others_posts',
			'easyteach-lms-settings',
			array( $this, 'admin_page' )
		);
	}

	public function register_rest_endpoint() {
		register_rest_route(
			'easyteachlms/v4',
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

new Settings( true );
