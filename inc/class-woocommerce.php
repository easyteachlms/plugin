<?php
namespace EasyTeachLMS;

use WPackio\Enqueue;

class WooCom {
	protected $attachment_meta_key = '_attached_course';
	protected $js_deps             = array( 'react', 'react-dom', 'wp-element', 'wp-components', 'wp-polyfill', 'wp-i18n', 'wp-api' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			// Attach Course Field
			add_filter( 'woocommerce_product_data_tabs', array( $this, 'tab' ) );
			add_action( 'woocommerce_product_data_panels', array( $this, 'tab_content' ) );
			add_action( 'woocommerce_process_product_meta', array( $this, 'save_fields' ), 10, 2 );
			// Enrollment
			// add_action( 'woocommerce_payment_complete', array( $this, 'process_order' ), 10, 1 );
			add_action( 'woocommerce_order_status_completed', array( $this, 'process_order' ), 10, 1 );

			// We're going to force some options on WooCommerce
			add_action( 'init', array( $this, 'force_enable_accounts' ) );

			// Add My Courses to WooCommerce Account Page:
			add_action( 'init', array( $this, 'add_courses_endpoint' ) );
			add_filter( 'query_vars', array( $this, 'courses_query_vars' ), 0 );
			add_filter( 'woocommerce_account_menu_items', array( $this, 'add_courses_link' ) );
			add_action( 'woocommerce_account_courses_endpoint', array( $this, 'courses_content' ) );
		}
	}

	// NEEDS:
	// @TODO WooCommerce courses tab (should be reusable display callback that we can also create a shortcode of and a function of for use elsewhere)
	// @TODO when finishing ordering auto login the user if new
	// @TODO when finished ordering the order receipt page should have some instructions, a tutorial video, and a link to their purchased course.

	public function force_enable_accounts() {
		update_option( 'woocommerce_enable_guest_checkout', 'no' );
		update_option( 'woocommerce_enable_checkout_login_reminder', 'yes' );
		update_option( 'woocommerce_enable_signup_and_login_from_checkout', 'yes' );
		update_option( 'woocommerce_registration_generate_username', 'yes' );
		update_option( 'woocommerce_enable_myaccount_registration', 'yes' );
	}

	protected function authorize_purchase( $product_id, $user_id ) {
		$course_id = get_post_meta( $product_id, $this->attachment_meta_key, true );
		if ( ! $course_id ) {
			return ''; // Exit early this is not an order that needs processing.
		}

		do_action( 'enroll_user', $user_id, $course_id );

		$data = get_user_meta( $user_id, '_purchased_courses', true );

		if ( ! $data ) {
			$data = array( $product_id );
		} else {
			$data[] = $product_id;
		}

		update_user_meta( $user_id, '_purchased_courses', $data );
	}

	public function process_order( $order_id ) {
		$order   = \wc_get_order( $order_id );
		$user_id = $order->get_user_id();

		if ( count( $order->get_items() ) > 0 ) {
			foreach ( $order->get_items() as $item ) {
				// Simple product authorization.
				$product_id = $item['product_id'];
				$this->authorize_purchase( $product_id, $user_id );
			}
		}
	}

	public function tab( $tabs ) {
		$tabs['easyteachlms'] = array(
			'label'    => 'EasyTeachLMS',
			'target'   => 'easy_teach_lms_data',
			'class'    => array( 'show_if_virtual' ),
			'priority' => 21,
		);
		return $tabs;
	}

	public function tab_content() {
		$enqueue = new Enqueue( 'easyTeachLMS', 'dist', '1.0.0', 'plugin', plugin_dir_path( __FILE__ ) );
		wp_enqueue_style( 'semantic-ui' );
		$enqueue->enqueue(
			'woocommerce',
			'productEdit',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $this->js_deps,
				'css_dep'   => array( 'semantic-ui' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		$attached_course = get_post_meta( get_the_ID(), $this->attachment_meta_key, true );

		ob_start();
		?>
		<div id="easy_teach_lms_data" class="panel woocommerce_options_panel hidden">
			<div id="elms-product-field"></div>
			<input id="elms-attached-product" name="elms_attached_product" value="<?php echo $attached_course; ?>" type="hidden"/>
		</div>
		<?php
		echo ob_get_clean();
	}

	public function save_fields( $id, $post ) {
		if ( ! empty( $_POST['elms_attached_product'] ) ) {
			update_post_meta( $id, $this->attachment_meta_key, $_POST['elms_attached_product'] );
		} else {
			delete_post_meta( $id, $this->attachment_meta_key );
		}
		error_log( print_r( get_post_meta( $id, $this->attachment_meta_key ), true ) );
	}

	public function array_insert( &$array, $position, $insert ) {
		if ( is_int( $position ) ) {
			array_splice( $array, $position, 0, $insert );
		} else {
			$pos   = array_search( $position, array_keys( $array ) );
			$array = array_merge(
				array_slice( $array, 0, $pos ),
				$insert,
				array_slice( $array, $pos )
			);
		}
	}

	public function add_courses_endpoint() {
		add_rewrite_endpoint( 'courses', EP_ROOT | EP_PAGES );
	}

	public function courses_query_vars( $vars ) {
		$vars[] = 'courses';
		return $vars;
	}

	public function add_courses_link( $items ) {
		$this->array_insert(
			$items,
			'orders',
			array(
				'courses' => 'Courses',
			)
		);
		return $items;
	}

	public function courses_content() {
		$user_id = get_current_user_id();
		ob_start();
		?>
		<h3>Purchased Courses</h3>
		<?php do_action( 'easyteachlms_woocom_courses', $user_id ); ?>
		<?php
		echo ob_get_clean();
	}

}

$woocommerce = new WooCom( true );
