<?php
namespace EasyLMS;

class install_plugins {
	public function __construct() {
		add_action( 'init', array( $this, 'acf_init' ), 10 );
		if ( ! class_exists( 'acf' ) ) {
			include_once plugin_dir_path( __FILE__ ) . 'acf/acf.php';
		}
		add_action( 'tgmpa_register', array( $this, 'required_plugins' ) );
	}
	public function acf_init() {
		if ( ! class_exists( 'acf' ) ) {
			$current_user = wp_get_current_user();
			// 1. customize ACF path
			add_filter( 'acf/settings/path', array( $this, 'acf_settings_path' ) );
			// 2. customize ACF dir
			add_filter( 'acf/settings/dir', array( $this, 'acf_settings_dir' ) );
			if ( $current_user->user_login != 'srubenstein' ) {
				// 3. Hide ACF field group menu item
				add_filter( 'acf/settings/show_admin', '__return_false' );
			}
			add_filter( 'site_transient_update_plugins', array( $this, 'acf_stop_update_notifications' ), 11 );
		}
	}

	public function acf_settings_path( $path ) {
		// update path
		$path = plugin_dir_path( __FILE__ ) . 'acf/';
		// return
		return $path;
	}

	public function acf_settings_dir( $dir ) {
		// update path
		$dir = plugin_dir_url( __FILE__ ) . 'acf/';
		// return
		return $dir;
	}

	public function acf_stop_update_notifications( $value ) {
		unset( $value->response[ plugin_dir_path( __FILE__ ) . 'acf/acf.php' ] );
		return $value;
	}

	public function required_plugins() {
		/*
		 * Array of plugin arrays. Required keys are name and slug.
		 * If the source is NOT from the .org repo, then source is also required.
		 */
		$plugins = array(
			// TODO: Not yet, we need to rebuild our WooCommerce support.
			// array(
			// 'name'      => 'WooCommerce',
			// 'slug'      => 'woocommerce',
			// 'required'  => false
			// ),
			array(
				'name'               => 'GitHub Updater', // The plugin name.
				'slug'               => 'github-updater', // The plugin slug (typically the folder name).
				'source'             => 'https://github.com/afragen/github-updater/archive/master.zip', // The plugin source.
				'required'           => true, // If false, the plugin is only 'recommended' instead of required.
				'version'            => '7.6.2', // E.g. 1.0.0. If set, the active plugin must be this version or higher. If the plugin version is higher than the plugin version installed, the user will be notified to update the plugin.
				'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch.
				'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins.
				'external_url'       => '', // If set, overrides default API URL and points to an external URL.
				'is_callable'        => '', // If set, this callable will be be checked for availability to determine if a plugin is active.
			),
		);
		/*
		 * Array of configuration settings. Amend each line as needed.
		 *
		 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
		 * strings available, please help us make TGMPA even better by giving us access to these translations or by
		 * sending in a pull-request with .po file(s) with the translations.
		 *
		 * Only uncomment the strings in the config array if you want to customize the strings.
		 */
		$config = array(
			'id'           => 'tgmpa',                 // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => '',                      // Default absolute path to bundled plugins.
			'menu'         => 'tgmpa-install-plugins', // Menu slug.
			'parent_slug'  => 'plugins.php',            // Parent menu slug.
			'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
			'has_notices'  => true,                    // Show admin notices or not.
			'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => true,                   // Automatically activate plugins after installation or not.
			'message'      => '',                      // Message to output right before the plugins table.
			'strings'      => array(
				'page_title'                      => __( 'Install Required Plugins', 'theme-slug' ),
				'menu_title'                      => __( 'Install Plugins', 'theme-slug' ),
				'installing'                      => __( 'Installing Plugin: %s', 'theme-slug' ), // %s = plugin name.
				'oops'                            => __( 'Something went wrong with the plugin API.', 'theme-slug' ),
				'notice_can_install_required'     => _n_noop(
					'EasyTeach LMS requires the following plugin: %1$s.',
					'EasyTeach LMS requires the following plugins: %1$s.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_can_install_recommended'  => _n_noop(
					'EasyTeach LMS recommends the following plugin: %1$s.',
					'EasyTeach LMS recommends the following plugins to enable enhanced functionality: %1$s.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_cannot_install'           => _n_noop(
					'Sorry, but you do not have the correct permissions to install the %1$s plugin.',
					'Sorry, but you do not have the correct permissions to install the %1$s plugins.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_ask_to_update'            => _n_noop(
					'The following plugin needs to be updated to its latest version to ensure maximum compatibility with EasyTeach LMS: %1$s.',
					'The following plugins need to be updated to their latest version to ensure maximum compatibility with EasyTeach LMS: %1$s.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_ask_to_update_maybe'      => _n_noop(
					'There is an update available for: %1$s.',
					'There are updates available for the following plugins: %1$s.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_cannot_update'            => _n_noop(
					'Sorry, but you do not have the correct permissions to update the %1$s plugin.',
					'Sorry, but you do not have the correct permissions to update the %1$s plugins.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_can_activate_required'    => _n_noop(
					'The following required plugin is currently inactive: %1$s.',
					'The following required plugins are currently inactive: %1$s.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_can_activate_recommended' => _n_noop(
					'The following recommended plugin is currently inactive: %1$s.',
					'The following recommended plugins are currently inactive: %1$s.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'notice_cannot_activate'          => _n_noop(
					'Sorry, but you do not have the correct permissions to activate the %1$s plugin.',
					'Sorry, but you do not have the correct permissions to activate the %1$s plugins.',
					'theme-slug'
				), // %1$s = plugin name(s).
				'install_link'                    => _n_noop(
					'Install plugin',
					'Install plugins',
					'theme-slug'
				),
				'update_link'                     => _n_noop(
					'Update plugin',
					'Update plugins',
					'theme-slug'
				),
				'activate_link'                   => _n_noop(
					'Activate plugin',
					'Activating plugins',
					'theme-slug'
				),
				'return'                          => __( 'Return to Required Plugins Installer', 'theme-slug' ),
				'plugin_activated'                => __( 'Plugin activated successfully.', 'theme-slug' ),
				'activated_successfully'          => __( 'The following plugin was activated successfully:', 'theme-slug' ),
				'plugin_already_active'           => __( 'No action taken. Plugin %1$s was already active.', 'theme-slug' ),  // %1$s = plugin name(s).
				'plugin_needs_higher_version'     => __( 'Plugin not activated. A higher version of %s is needed for EasyTeach LMS. Please update the plugin.', 'theme-slug' ),  // %1$s = plugin name(s).
				'complete'                        => __( 'All plugins installed and activated successfully. %1$s', 'theme-slug' ), // %s = dashboard link.
				'contact_admin'                   => __( 'Please contact the administrator of this site for help.', 'tgmpa' ),

				'nag_type'                        => 'error', // Determines admin notice type - can only be 'updated', 'update-nag' or 'error'.
			),
		);
		tgmpa( $plugins, $config );
	}
}

new install_plugins();
