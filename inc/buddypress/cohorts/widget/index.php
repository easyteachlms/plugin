<?php

class My_Groups_Widget extends Cohorts {
	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'wp_dashboard_setup', array( $this, 'the_widget' ) );
		}
	}

	public function the_widget() {
		wp_add_dashboard_widget(
			'my-groups-widget',
			'Your Groups At A Glance',
			array( $this, 'the_widget_callback' ),
			null, // Control Callback
			array(
				'userId' => get_current_user_id(),
			),
		);
	}

	public function the_widget_callback( $post, $callback_args ) {
		$assets  = parent::wpackio()->register(
			'wp-admin',
			'bpCohortsWidget',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array_merge( parent::$js_deps, array( 'bp-api-request' ) ),
				'css_dep'   => array( 'wp-components' ),
				'in_footer' => true,
				'media'     => 'all',
			)
		);

		$handles = array(
			'js'  => array_pop( $assets['js'] )['handle'],
			'css' => array_pop( $assets['css'] )['handle'],
		);
		
		wp_localize_script(
			$handles['js'],
			'myGroupsWidget',
			$callback_args['args'],
		);
		wp_enqueue_script( $handles['js'] );
		wp_enqueue_style( $handles['css'] );

		echo '<div id="my-groups-widget-render"></div>';
	}
}

new My_Groups_Widget( true );
