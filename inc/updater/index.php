<?php

class Updater extends EasyTeachLMS {
    public function __construct($init = false) {
        if ( true === $init ) {
            /**
            * For further details please visit http://docs.easydigitaldownloads.com/article/383-automatic-upgrades-for-wordpress-plugins
            */
            define( 'EDD_STORE_URL', 'https://easyteachlms.com' );
            define( 'EDD_ITEM_ID', 2317 );
            define( 'EDD_ITEM_NAME', 'EasyTeach LMS' );

            if( !class_exists( 'EasyTeachLMSPluginUpdater' ) ) {
                // load our custom updater
                include( dirname( __FILE__ ) . '/plugin-updater.php' );
            }
			
			add_action( 'admin_init', array($this, 'register_license_key_options') );
            add_action( 'init', array($this, 'plugin_updater') );
            add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
        }
    }

    /**
     * Initialize the updater. Hooked into `init` to work with the
     * wp_version_check cron job, which allows auto-updates.
     */
    public function plugin_updater() {
        // To support auto-updates, this needs to run during the wp_version_check cron job for privileged users.
        $doing_cron = defined( 'DOING_CRON' ) && DOING_CRON;
        if ( ! current_user_can( 'manage_options' ) && ! $doing_cron ) {
            return;
        }

        // retrieve our license key from the DB
        $license_key = trim( get_option( 'easyteachlms_license_key' ) );

        // setup the updater
        $updater = new EasyTeachLMSPluginUpdater( EDD_STORE_URL, EASYTEACHLMS_FILE,
            array(
                'version' => EASYTEACHLMS_VERSION,
                'license' => $license_key,
                'item_id' => EDD_ITEM_ID,
                'author'  => 'Seth Rubenstein',
                'beta'    => false,
            )
        );
    }

	public function register_license_key_options() {
		// creates our settings in the options table
		register_setting('easyteachlms_license', 'easyteachlms_license_key' );
	}

	public function register_rest_endpoints() {
		register_rest_route(
			'easyteachlms/v4',
			'/settings/activate',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_activate_license' ),
				'args'                => array(),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			'easyteachlms/v4',
			'/settings/deactivate',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_deactivate_license' ),
				'args'                => array(),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	public function restfully_check_license() {
		global $wp_version;
	
		$license = trim( get_option( 'easyteachlms_license_key' ) );
	
		$api_params = array(
			'edd_action'  => 'check_license',
			'license'     => $license,
			'item_name'   => urlencode( EDD_ITEM_NAME ),
			'url'         => home_url(),
			'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
		);
	
		// Call the custom API.
		$response = wp_remote_post( EDD_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );
	
		if ( is_wp_error( $response ) )
			return false;
	
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );
	
		if( $license_data->license == 'valid' ) {
			echo 'valid'; exit;
			// this license is still valid
		} else {
			echo 'invalid'; exit;
			// this license is no longer valid
		}
	}

	public function restfully_deactivate_license(\WP_REST_Request $request) {
		$payload = json_decode( $request->get_body(), true );
		// listen for our activate button to be clicked
		if( !empty($payload) ) {
			$success = false;
			// retrieve the license from the database
			$license = trim( get_option( 'easyteachlms_license_key' ) );

			// data to send in our API request
			$api_params = array(
				'edd_action'  => 'deactivate_license',
				'license'     => $license,
				'item_name'   => urlencode( EDD_ITEM_NAME ), // the name of our product in EDD
				'url'         => home_url(),
				'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
			);

			// Call the custom API.
			$response = wp_remote_post( EDD_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );

			// make sure the response came back okay
			if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
				if ( is_wp_error( $response ) ) {
					$message = $response->get_error_message();
				} else {
					$message = __( 'An error occurred, please try again.' );
				}
			}

			// decode the license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );

			// $license_data->license will be either "deactivated" or "failed"
			if( $license_data->license === 'deactivated' ) {
				$success = true;
				$message = 'Your license has been succesfully deactivated';
				delete_option( 'eayteachlms_license_status' );
			}

			return array(
				'success' => $success,
				'message' => $message,
			);
		}
	}

	public function restfully_activate_license(\WP_REST_Request $request) {
		$payload = json_decode( $request->get_body(), true );

		if( !empty($payload) ) {
			$success = false;
			$license = trim( $payload['licenseKey'] );
	
			// data to send in our API request
			$api_params = array(
				'edd_action'  => 'activate_license',
				'license'     => $license,
				'item_name'   => urlencode( EDD_ITEM_NAME ),
				'url'         => home_url(),
				'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
			);
	
			// Call the custom API.
			$response = wp_remote_post( EDD_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );
	
			// make sure the response came back okay
			if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
	
				if ( is_wp_error( $response ) ) {
					$message = $response->get_error_message();
				} else {
					$message = __( 'An error occurred, please try again.' );
				}
	
			} else {
	
				$license_data = json_decode( wp_remote_retrieve_body( $response ) );
	
				if ( false === $license_data->success ) {
	
					switch( $license_data->error ) {
	
						case 'expired' :
	
							$message = sprintf(
								__( 'Your license key expired on %s.' ),
								date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) )
							);
							break;
	
						case 'disabled' :
						case 'revoked' :
	
							$message = __( 'Your license key has been disabled.' );
							break;
	
						case 'missing' :
	
							$message = __( 'Invalid license.' );
							break;
	
						case 'invalid' :
						case 'site_inactive' :
	
							$message = __( 'Your license is not active for this URL.' );
							break;
	
						case 'item_name_mismatch' :
	
							$message = sprintf( __( 'This appears to be an invalid license key for %s.' ), EDD_ITEM_NAME );
							break;
	
						case 'no_activations_left':
	
							$message = __( 'Your license key has reached its activation limit.' );
							break;
	
						default :
	
							$message = __( 'An error occurred, please try again.' );
							break;
					}
				} else {
					$success = true;
					$message = __( 'Your license has succesfully been activated.' );
				}
	
			}

			// $license_data->license will be either "valid" or "invalid"
			update_option('easyteachlms_license_key', $payload['licenseKey']);
			update_option( 'eayteachlms_license_status', $license_data->license );

			return array(
				'success' => $success,
				'message' => $message,
			);
		}
	}
}

new Updater(true);