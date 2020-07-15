<?php
namespace EasyLMS;

class videos {
	public function __construct() {

	}

	public function init() {
		add_action( 'init', array( $this, 'register' ) );
		$this->register_fields();
		add_action( 'wp_ajax_get_user_status', array( $this, 'get_user_status' ) );
		add_action( 'wp_ajax_mark_video_as_complete', array( $this, 'mark_video_as_complete' ) );
		add_filter( 'embed_oembed_html', array( $this, 'youtube_oembed' ), 999, 4 );
	}

	public function register() {
		$labels = array(
			'name'               => _x( 'Course Videos', 'post type general name' ),
			'singular_name'      => _x( 'Video', 'post type singular name' ),
			'add_new'            => __( 'Add New' ),
			'add_new_item'       => __( 'Video' ),
			'edit_item'          => __( 'Edit Video' ),
			'new_item'           => __( 'New Video' ),
			'view_item'          => __( 'View Video' ),
			'search_items'       => __( 'Search Video' ),
			'not_found'          => __( 'No Video Found' ),
			'not_found_in_trash' => __( 'No Video in Trash' ),
			'parent_item_colon'  => __( 'Video' ),
			'menu_name'          => __( 'Course Videos' ),
		);

		$taxonomies = array();

		$supports = array( 'title', 'revisions', 'thumbnail' );

		$post_type_args = array(
			'labels'              => $labels,
			'singular_label'      => __( 'Video' ),
			'public'              => true,
			'exclude_from_search' => false,
			'show_ui'             => true,
			'publicly_queryable'  => true,
			'query_var'           => true,
			'capability_type'     => 'post',
			'has_archive'         => true,
			'hierarchical'        => false,
			'rewrite'             => array(
				'slug'       => 'video',
				'with_front' => false,
			),
			'show_in_rest'        => true,
			'supports'            => $supports,
			'show_in_menu'        => 'easyteach-lms',
			'taxonomies'          => $taxonomies,
		);
		register_post_type( 'video', $post_type_args );
	}

	public function register_fields() {
		register_field_group(
			array(
				'id'         => 'acf_class-options',
				'title'      => 'Video Options',
				'fields'     => array(
					array(
						'key'               => 'field_557e48c8e30f9',
						'label'             => 'Video',
						'name'              => 'video_source',
						'prefix'            => '',
						'type'              => 'oembed',
						'instructions'      => '',
						'required'          => 1,
						'conditional_logic' => 0,
						'wrapper'           => array(
							'width' => '',
							'class' => '',
							'id'    => '',
						),
						'width'             => '',
						'height'            => '',
					),
				),
				'location'   => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => 'video',
							'order_no' => 0,
							'group_no' => 0,
						),
					),
				),
				'options'    => array(
					'position'       => 'acf_after_title',
					'layout'         => 'no_box',
					'hide_on_screen' => array(),
				),
				'menu_order' => 0,
			)
		);
	}

	private function filter_source( $video_url ) {
		$url = $video_url;
		if ( preg_match( '#^//(?:www\.)?youtube.com#', $video_url ) ) {
			$search  = '/youtube\.com\/watch\?v=([a-zA-Z0-9]+)/smi';
			$replace = 'youtube.com/embed/$1';
			$url     = preg_replace( $search, $replace, $video_url );
		} elseif ( preg_match( '#^//(?:www\.)?vimeo.com#', $video_url ) ) {

		}
		return $url;
	}

	// https://webdevstudios.com/2014/10/17/customizing-mediaelement-js-for-wordpress/
	// TODO: I need to impielement the markup and js for using mediaelementjs direct from WordPress for youtube, vimeo, and self hosted videos.
	public function get_inline_player( $video_id, $course_id, $module_slug, $video_slug ) {
		if ( ! $video_id && ! $course_id && ! $module_slug ) {
			// TODO: Fire WP Error
			return;
		}

		wp_enqueue_script( 'wp-mediaelement' );
		wp_enqueue_script( 'easylms-video-player' );
		wp_enqueue_style( 'wp-mediaelement' );
		// wp_enqueue_style('media-views');
		// TODO Implement responsive video https://gist.github.com/cfxd/c9733fa71efc6c6efb18

		$video_src = get_post_meta( $video_id, 'video_source', true );
		$video_src = $this->filter_source( $video_src );
		$markup    = false;
		if ( false !== strpos( $video_src, 'youtube' ) ) {
			$video_src     = str_replace( 'watch?v=', 'embed/', $video_src );
			$video_service = 'youtube';
		} elseif ( false !== strpos( $video_src, 'vimeo' ) ) {
			$video_src     = str_replace( 'vimeo.com', 'player.vimeo.com/video', $video_src );
			$video_service = 'vimeo';
			wp_enqueue_script( 'mediaelement-vimeo' );
		}
		if ( $video_src ) {
			$courses     = new courses();
			$watch_state = $courses->get_item_state( $course_id, $module_slug, $video_slug );

			$markup = "<div class='video-wrap easylms-inline-player'><div class='video-content' data-watch-state='{$watch_state}'><video width='100%' height='634' id='player-{$video_id}' class='load-video-init' preload=><source type='video/{$video_service}' src='$video_src' /></video></div></div>";

		}

		return apply_filters( 'elms_inline_player_markup', $markup, $video_id );
	}

	public function youtube_oembed( $original, $url, $attr, $post_id ) {
		if ( is_admin() ) {
			return $original;
		}

		// If video id is not set
		if ( ! isset( $attr['id'] ) || empty( $attr['id'] ) ) {
			$video_id = '';
			if ( preg_match( '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $url, $matches ) && isset( $matches[1] ) && ! empty( $matches[1] ) ) {
				$video_id = $matches[1];
			}
			$attr['id'] = $video_id;
		}

		// Return original embed if video id is not found
		if ( $attr['id'] == '' ) {
			return $original;
		}

		wp_enqueue_script( 'wp-mediaelement' );
		wp_enqueue_style( 'wp-mediaelement' );

		$video_service = 'youtube';
		$video_src     = $this->filter_source( $matches[0] );

		// $html = print_r($matches, true);
		$markup = "<div class='video-wrap easylms-oembed-player'><div class='video-content'><video width='100%' height='634' id='player-{$video_id}' class='load-video-init' preload=><source type='video/{$video_service}' src='$video_src' /></video></div></div>";

		return $markup;
	}
}

$EasyTeachLMS_videos = new videos();
$EasyTeachLMS_videos->init();
