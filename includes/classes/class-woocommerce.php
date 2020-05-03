<?php
namespace EasyLMS;

class woocommerce {
	public function __construct() {

	}
	public function init() {
		// Rewrites
		add_action( 'init', array( $this, 'rewrite' ), 10 );
		// Authorization
		add_action( 'woocommerce_payment_complete', array( $this, 'process_order' ), 10, 3 );
	}
	public function rewrite() {
		$permalink_base_raw = get_option('woocommerce_permalinks');
		$permalink_base = $permalink_base_raw['product_base'];
		$permalink_base = str_replace ( '/', '', $permalink_base );

		// /product/product-name/module-name/item-name
		add_rewrite_rule(
			'^'.$permalink_base.'\/([^/]*)\/([^/]*)\/([^/]*)$',
			'index.php?product=$matches[1]&moduleSlug=$matches[2]&itemSlug=$matches[3]',
			'top'
		);

		// /product/product-name/module-name/
		// /product/product-name/quiz
		add_rewrite_rule(
			'^'.$permalink_base.'\/([^/]*)\/([^/]*)$',
			'index.php?product=$matches[1]&moduleSlug=$matches[2]',
			'top'
		);
	}
	public function process_order( $order_id ) {
		$order = wc_get_order( $order_id );
		$user_id = wp_get_current_user()->ID;

		if ( sizeof( $order->get_items() ) > 0 ) {
			foreach( $order->get_items() as $item ) {

				// Simple product authorization.
				$product_id = $item["product_id"];
				$this->authorize_purchase( $product_id, $user_id );

			}
		}
	}
	protected function authorize_purchase( $product_id, $user_id ) {
		$course_id = get_post_meta( $product_id, '_linked_course', true );
		if ( ! $course_id ) {
			return ""; // Exit early this is not an order that needs processing.
		}

		$data = get_user_meta( $user_id, '_enrolled_courses', true );

		if ( ! $data ) {
			$data = array( $course_id );
		} else {
			$data[] = $course_id;
		}

		update_user_meta( $user_id, '_enrolled_courses', $data );
		//////////////////////////////////////////////////////////////////
		$data = get_user_meta( $user_id, '_purchased_courses', true );

		if ( ! $data ) {
			$data = array( $product_id );
		} else {
			$data[] = $product_id;
		}

		update_user_meta( $user_id, '_purchased_courses', $data );
	}
}

$woocommerce = new woocommerce();
$woocommerce->init();
