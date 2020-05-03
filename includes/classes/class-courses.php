<?php
namespace EasyLMS;

class courses {

	// Course Level Globals ////////////
	public $current_course      = false;
	public $current_course_id   = false;

	// Current Item Globals ////////////
	public $is_item             = false;
	public $current_item        = false;
	public $current_item_id     = false;
	public $current_item_slug   = false;
	public $current_item_type   = false;

	// Current Module Globals //////////
	public $is_module           = false;
	public $current_module_slug = false;
	public $modules_order       = array();

	////////////////////////////////////
	public $user_state          = false;

	public function __construct( $passthrough = false ) {
		// If there is no data in the current_course object then initialize it. Otherwise leave it untouched.
		if ( false === $this->current_course ) {
			$this->init_course_object( $passthrough );
		}
	}

	public function init() {
		add_action( 'init', array( $this, 'register' ) );
		add_action( 'init', array( $this, 'init_course_object' ), 10 );
		add_action( 'wp_footer', array( $this, 'output_json_course_object' ) );

		add_filter( 'the_content', array( $this, 'display_logic' ), 100, 1 );
		add_filter( 'bbp_get_single_forum_description', array( $this, 'display_logic' ), 10 );

		add_filter( 'post_class', array( $this, 'is_enrolled_post_class' ), 10, 3 );
	}

	public function register() {
		$labels = array(
			'name' => _x( 'Courses', 'post type general name' ),
			'singular_name' => _x( 'Course', 'post type singular name' ),
			'add_new' => __( 'Add New' ),
			'add_new_item' => __( 'Course' ),
			'edit_item' => __( 'Edit Course' ),
			'new_item' => __( 'New Course' ),
			'view_item' => __( 'View Course' ),
			'search_items' => __( 'Search Courses' ),
			'not_found' => __( 'No Course Found' ),
			'not_found_in_trash' => __( 'No Courses in Trash' ),
			'parent_item_colon' => __( 'Course' ),
			'menu_name' => __( 'Courses' )
		);

		$taxonomies = array( 'category' );

		$supports = array( 'title', 'editor', 'revisions', 'thumbnail', 'excerpt', 'author' );

		$post_type_args = array(
			'labels' => $labels,
			'singular_label' => __('Course'),
			'public' => true,
			'exclude_from_search' => false,
			'show_ui'       => true,
			'publicly_queryable' => true,
			'query_var' => true,
			'capability_type' => 'post',
			'has_archive' => true,
			'hierarchical' => false,
			'rewrite' => array('slug' => 'course', 'with_front' => false ),
			'show_in_rest' => true,
			'supports' => $supports,
			'menu_position' => 5,
			'menu_icon' => 'dashicons-book',
			'taxonomies' => $taxonomies
		);
		register_post_type('course', $post_type_args);
	}

	//////////////
	// User, Item, amnd Module States
	//////////////
	public function is_enrolled( $post_id ) {
		if ( ! $post_id ) {
			global $post;
			$post_id = $post->ID;
		}
		$user_id = get_current_user_id();
		$courses = get_user_meta( $user_id, '_enrolled_courses', true );
		if ( empty( $courses ) ) {
			return false;
		} elseif ( in_array( $post_id, $courses ) ) {
			return true;
		} else {
			return false;
		}
	}
	public function is_enrolled_post_class( $classes, $class, $post_id ) {
		if ( true === $this->is_enrolled( $post_id ) ) {
			$classes[] = 'user-is-enrolled';
		}
		return $classes;
	}

	// Check the current module and see if the previous module was completed and if so allow true
	public function get_module_state( $course_id, $module_slug ) {
		$user_id = get_current_user_id();
		$data = get_user_meta( $user_id, '_user_course_progress', true );
		if ( empty($data) ) {
			return false;
		}
		$pre_req_state = 'not-complete';
		if ( ! array_key_exists( 'pre-req', $data[$course_id][$module_slug] ) ) {
			return false;
		}
		if ( 'module-req-complete' == $data[$course_id][$module_slug]['pre-req'] ) {
			$pre_req_state = 'complete';
		}
		return $pre_req_state;
	}

	public function get_item_state( $course_id, $module_slug, $item_slug ) {
		$user_id = get_current_user_id();
		$data = get_user_meta( $user_id, '_user_course_progress', true );
		if ( ! $data || ! array_key_exists( $course_id, $data ) ) {
			return false;
		}

		$watch_state = false;
		if ( ! array_key_exists( $module_slug, $data[$course_id] ) ) {
			return false;
		}
		if ( array_key_exists( $item_slug, $data[$course_id][$module_slug] ) ) {
			$watch_state = 'watched';
			if ( 'complete' === $data[$course_id][$module_slug][$item_slug] ) {
				$watch_state = 'completed';
			}
		}
		return $watch_state;
	}

	//////////////
	// Data Model
	/////////////
	// 1. Transitory functions. If you imagine the course object as a tree then these functions help you transit the tree, finding what position you are in the tree, where the next branch is - the previous branch.
	// 2. Course Object.

	// 1. Transitory Functions
	public function get_prev_in_array($array, $key) {
		$currentKey = key($array);
		while ($currentKey !== null && $currentKey != $key) {
			next($array);
			$currentKey = key($array);
		}
		return prev($array);
	 }

	/**
	 * Pass in the id of the video you want to get it's position and the search array of video ids and we'll return the next video and the previous video.
	 */
	public function get_position_within_course($item_id, $search_array) {

		if ( ! is_array( $search_array ) ) {
			return;
		}

		$prev = false;
		$next = false;

		$current_item_pos = array_search( $item_id, $search_array );
		if ( $current_item_pos != 0 ) {
			$prev_pos = $current_item_pos - 1;
			$prev = $search_array[$prev_pos];
		}

		if ( $item_id != end($search_array) ) {
			$next_pos = $current_item_pos + 1;
			$next = $search_array[$next_pos];
		}

		$return = array(
			'current' => $item_id,
			'next'    => $next,
			'prev'    => $prev,
			'end'     => false,
		);

		if ( $item_id == end($search_array) ) {
			$return['end'] = true;
		}

		return $return;
	}

	public function get_next_module($array, $key) {
		$currentKey = key($array);
		while ($currentKey !== null && $currentKey != $key) {
			next($array);
			$currentKey = key($array);
		}
		return next($array);
	}

	public function get_next_item($item_id, $course_id, $post_id, $module_slug) {
		if ( ! $module_slug ) {
			return false;
		}
		$course_structure = $this->get_course_object( $course_id );
		$positions = $this->get_position_within_course( $item_id, $course_structure[$module_slug]['order'] );
		if ( empty($positions) ) {
			return false;
		}

		$return = false;
		if ( false != $positions['next'] ) {
			$next_video = $this->get_post_item($positions['next'], $course_id);
			$link = get_permalink($post_id).$module_slug.'/'.$next_video->post_name;
			$return = array(
				'title' => $next_video->post_title,
				'url' => $link,
				'slug' => $item_id
			);
		}
		return $return;
	}

	public function get_prev_item($item_id, $course_id, $post_id, $module_slug) {
		if ( ! $module_slug ) {
			return false;
		}
		$course_structure = $this->get_course_object( $course_id );
		$positions = $this->get_position_within_course( $item_id, $course_structure[$module_slug]['order'] );
		if ( empty($positions) ) {
			return false;
		}

		$return = false;
		if ( false !== $positions['prev'] ) {
			$prev_video = $this->get_post_item($positions['prev'], $course_id);
			$link = get_permalink($post_id).$module_slug.'/'.$prev_video->post_name;
			$return = array(
				'title' => $prev_video->post_title,
				'url' => $link,
				'slug' => $item_id
			);
		}
		return $return;
	}

	// 2. Course Object

	/**
	 * Returns a semi standardized object (WPPost) driven structure for post (course) items.
	 * This includes a strcutring and search function if you're looking for an item based on it's slug or "id" that'll return that items title, content, and declared slug. This could be a video, a post, a note, all of them will return a similiar WPPost obj format. You may ask why this bifercated data structure. Performance. This allows us to retrieve only the data we need in various functions quickly. Rather than searching for information through arrays and SQL queries we can know the positions of more given points in each requests data structure letting us shave seconds in each call.
	 * @param  [type] $id        if ID given is an integer we assume post (post or video). If string we assume note
	 * @param  [type] $course_id If you're seeking a note you must pass a course id in so that the course object can be retrieved.
	 * @return OBJ WPPost
	 */
	public function get_post_item($id, $course_id = null) {
		if ( is_int($id) ) {
			return get_post($id);
		} elseif ( !empty($course_id) ) {
			$courseOBJ = $this->get_course_object($course_id);
			$module_slug = $courseOBJ['module_lookup'][$id];
			$item_pos = array_search( $id, $courseOBJ[$module_slug]['order'] );
			$return = array(
				'ID' => $id,
				'module_slug' => $module_slug,
				'post_title' => $courseOBJ[$module_slug]['items'][$item_pos]['title'],
				'post_name' => $courseOBJ[$module_slug]['items'][$item_pos]['slug'],
				'post_content' => $courseOBJ[$module_slug]['items'][$item_pos]['value']
			);
			return (object) $return;
		} else {
			return false;
		}
	}

	/**
	 * TODO: I would restructure this as its grown in scope and has some tech debt. Ideally instead of modules existing at the root they'd be under a `modules` key.
	 * @param  [type] $course_id [description]
	 * @return [type]            [description]
	 */
	public function get_course_object( $course_id ) {
		if ( ! $course_id ) {
			return false;
		}
		$array = array(
			'module_lookup' => array(),
			'modules' => array(),
			'quiz' => false,
			'total_items' => 0,
		);
		$modules = get_field( 'modules', $course_id );
		$module_i = 1;
		if($modules){
			$total_items = 0;
			foreach($modules as $module){
				$module_slug = preg_replace('/[^A-Za-z0-9-]+/', '-', strtolower($module['title']) );
				$array['modules'][$module_slug] = $module['title'];
				$this->modules_order[$module_i] = $module_slug;

				$array[$module_slug] = array(
					'title' => $module['title'],
					'order' => array(),
					'prereq' => false, // Preq denotes that this module requires the prior module to be completed for access.
					'prev_module' => false,
				);

				if ( true === $module['prerequisite'] ) {
					$array[$module_slug]['prereq'] = true;
				}

				foreach ($this->modules_order as $key => $value) {
					if ( $module_slug == $value ) {
						$array[$module_slug]['prev_module'] = $this->get_prev_in_array($this->modules_order, $key);
					}
				}

				foreach ($module['items'] as $key => $value) {
					$total_items++;
					if ( 'video' == $value['acf_fc_layout'] ) {
						$item_id = $value['video']->ID;
						$array[$module_slug]['items'][] = array(
							'type' => $value['acf_fc_layout'],
							'title' => $value['video']->post_title,
							'slug' => $value['video']->post_name,
							'id' => $item_id,
							'value' => get_post_meta($value['video']->ID, 'video_source', true)
						);
					} elseif ( 'note' == $value['acf_fc_layout'] ) {
						$item_slug = preg_replace('/[^A-Za-z0-9-]+/', '-', strtolower($value['title']) );
						$item_id = $item_slug;
						$array[$module_slug]['items'][] = array(
							'type' => $value['acf_fc_layout'],
							'title' => $value['title'],
							'slug' => $item_slug,
							'id' => $item_id,
							'value' => $value['note']
						);
					} elseif ( 'post' == $value['acf_fc_layout'] ) {
						$item_id = $value['post']->ID;
						$array[$module_slug]['items'][] = array(
							'type' => $value['acf_fc_layout'],
							'title' => $value['post']->post_title,
							'slug' => $value['post']->post_name,
							'id' => $item_id,
							'value' => $value['post']->post_content
						);
					}
					$array[$module_slug]['order'][] = $item_id;
					$array['module_lookup'][$item_id] = $module_slug; // This provides a library that lets us easily key directly off an item's id to get the module_slug directly without having to navigate through an array structure. With that information, the module slug, we can even more quickly get the item's information like title and value.
				}

				if ( $module['enable_module_quiz'] ) {
					$total_items++;
					$quiz = new quiz();
					$array[$module_slug]['quiz_raw'] = $module['quiz'];
					$array[$module_slug]['items'][] = array(
						'type' => 'quiz',
						'title' => 'Quiz',
						'slug' => 'quiz',
						'id' => 'quiz',
						'value' => $quiz->object( $course_id, $module['quiz'] )
					);
				}

				$module_i++;
			}
			$array['total_items'] = $total_items;
		}

		$downloads = get_field('downloads', $course_id);
		if ( $downloads ) {
			$array['downloads'] = array();
			foreach ($downloads as $download) {
				$array['downloads'][] = (object) $download['file'];
			}
		}

		$array = apply_filters('easylms_course_object', $array, $course_id);
		return $array;
	}

	/**
	 * Outputs a json encoded array for a given course by post_id
	 */
	public function get_json_course_object( $course_id, $post_id = false ) {
		$array = $this->get_course_object( $course_id );
		$item_slug = false;
		$item_id = false;
		global $wp_query;
		if ( isset( $wp_query->query_vars['itemSlug'] ) ) {
			$item_slug = $wp_query->query_vars['itemSlug'];
			$item_id = $this->current_item_id;
		}

		$module_slug = false;
		$next_module_slug = false;
		if ( isset( $wp_query->query_vars['moduleSlug'] ) ) {
			$module_slug = $wp_query->query_vars['moduleSlug'];
			$next_module_slug = $this->get_next_module($array['modules'], $module_slug);
			$next_module_slug = preg_replace('/[^A-Za-z0-9-]+/', '-', strtolower($next_module_slug) );
		}

		// Check for the next module and see if it has pre-req set.

		if ( false === $post_id ) {
			$post_id = $course_id;
		}

		$next_item = false;
		if ( $item_slug !== $this->get_next_item( $item_id, $course_id, $post_id, $module_slug )['slug'] ) {
			$next_item = $this->get_next_item( $item_id, $course_id, $post_id, $module_slug);
			$next_item = $next_item['url'];
		}

		$course_slug = get_post($course_id);
		$course_slug = $course_slug->post_name;

		if ( ! empty( $wp_query->queried_object->post_name ) ) {
			$array['current'] = array(
				'course_id' => $course_id,
				'course_slug' => $course_slug,
				'module_slug' => $module_slug,
				'item_slug' => $item_slug,
				'next_item' => $next_item,
				'next_module_slug' => $next_module_slug,
			);
		}

		$quiz = new quiz();
		$array['quiz'] = $quiz->object( $course_id );

		return json_encode( $array );
	}

	public function output_json_course_object() {
		wp_reset_postdata();

		if ( is_singular() ) {
			global $post;
			$course_ID = $post->ID;
		}

		// For WooCommerce and BBPress we check to see if there is a linked course,
		// if not then we'll proceed to fail gracefully and not output a courseOBJ object.
		if ( is_singular( array( 'product', 'forum' ) ) ) {
			$course_ID = get_post_meta( $course_ID, '_linked_course', true );
			if ( empty( $course_ID ) ) {
				return false;
			}
		}

		// Check if is in supported post type
		if ( is_singular( array('course', 'product', 'forum') ) ) {
			$obj = $this->get_json_course_object($course_ID, $post->ID);
			echo "<script>var courseOBJ = {$obj};</script>";
		}
	}

	public function reset_course_object() {
		if ( $this->current_course != false ) {
			$this->current_course = false;
		}
		if ( $this->current_course_id != false ) {
			$this->current_course_id = false;
		}
		if ( $this->current_item != false ) {
			$this->current_item = false;
		}
		if ( $this->current_item_id != false ) {
			$this->current_item_id = false;
		}
		if ( $this->current_item_slug != false ) {
			$this->current_item_slug = false;
		}
		if ( $this->current_item_type != false ) {
			$this->current_item_type = false;
		}
		if ( $this->current_module_slug != false ) {
			$this->current_module_slug = false;
		}
		if ( $this->user_state != false ) {
			$this->user_state = false;
		}
	}

	public function init_course_object( $pass_through = false ) {
		$this->reset_course_object();

		global $post;

		if ( false !== $pass_through ) {
			$post = $pass_through;
		}

		if ( ! is_object($post)  ) {
			return false;
		}

		$continue = false;
		if ( 'product' == $post->post_type ) {
			$continue = true;
		}
		if ( 'course' == $post->post_type || 'forum' == $post->post_type ) {
			$continue = true;
		}
		if ( false == $continue ) {
			return;
		}

		if ( 'product' === $post->post_type || 'forum' === $post->post_type ) {
			$course_id = get_post_meta( $post->ID, '_linked_course', true );
		} else {
			$course_id = $post->ID;
		}

		global $wp_query;

		$this->current_course = $this->get_course_object( $course_id );

		$this->current_course_id = $course_id;

		if ( isset( $wp_query->query_vars['itemSlug'] ) ) {
			$this->current_item_slug = $wp_query->query_vars['itemSlug'];

			$this->current_item_type = $this->get_item_type_by_slug( $wp_query->query_vars['itemSlug'], $course_id );

			if ( $this->current_item_type == 'note' ) {
				$this->current_item = $this->get_post_item( $wp_query->query_vars['itemSlug'], $course_id );
			} elseif ( $this->current_item_type == 'quiz' ) {
				$this->current_item = (object) array(
					'ID' => 'module_slug_quiz',
				);
			} else {
				$this->current_item = get_page_by_path( $wp_query->query_vars['itemSlug'], OBJECT, array( 'video','post' ) );
			}

			$this->current_item_id = $this->current_item->ID;
		}

		if ( isset( $wp_query->query_vars['moduleSlug'] ) ) {
			$this->current_module_slug = $wp_query->query_vars['moduleSlug'];
		}
	}



	// Simple search through the course object to search for the type of this item by slug.
	// TODO: Look into rewriting this, in fact make the whole thing class based so it stores this info once.
	public function get_item_type_by_slug( $item_slug, $course_id, $modules = null ) {
		if ( empty($modules) ) {
			$modules = $this->current_course;
		}
		$type = '';
		foreach ($modules as $key => $module) {
			if ( $key !== "module_lookup" && $key !== 'modules' && $key !== 'downloads' && $key !== 'quiz' && $key !== 'total_items') {
				if ( $module['items'] ) {
					foreach( $module['items'] as $pos => $item ) {
						// When you find the current item output the type
						if ( $item_slug === $item['slug'] ) {
							$type = $item['type'];
						}
					}
				}
			}
		}
		return $type;
	}

	// Core Course UI
	public function get_item_pagination($item_id, $course_id, $post_id, $module_slug) {
		$course_structure = $this->get_course_object( $course_id );
		$positions = $this->get_position_within_course( $item_id, $course_structure[$module_slug]['order'] );
		if ( empty($positions) ) {
			return false;
		}

		$markup = '<div class="ui equal width unstackable vertically padded grid">';
		if ( ! empty( $positions['prev'] ) ) {
			$prev_video = $this->get_post_item($positions['prev'], $course_id);
			$link = get_permalink($post_id).$module_slug.'/'.$prev_video->post_name;
			$markup .= '<div class="column">';
			$markup .= '<a href="'.$link.'" class="ui labeled icon fluid button"><i class="angle double left icon"></i> '.$prev_video->post_title.'</a>';
			$markup .= '</div>';
		}
		if ( ! empty( $positions['next'] ) ) {
			$next_video = $this->get_post_item($positions['next'], $course_id);
			$link = get_permalink($post_id).$module_slug.'/'.$next_video->post_name;
			$markup .= '<div class="right aligned column">';
			$markup .= '<a href="'.$link.'" class="ui right labeled icon fluid button">'.$next_video->post_title.' <i class="angle double right icon"></i></a>';
			$markup .= '</div>';
		}
		$markup .= '</div>';

		return $markup;
	}

	public function display_logic( $content ) {
		global $post;

		$original_content = $content;

		if ( 'course' === $post->post_type ) {
			$post_id = $post->ID;
			$course_id = $post->ID;
		} elseif ( 'product' === $post->post_type ) {
			$post_id = $post->ID;
			$course_id = get_post_meta( $post->ID, '_linked_course', true );
		} elseif ( 'forum' === $post->post_type ) {
			$post_id = $post->ID;
			$course_id = get_post_meta( $post->ID, '_linked_course', true );
		} else {
			// if is neither of these then return content early.
			return $content;
		}

		if ( false === $this->current_course ) {
			$this->init_course_object();
		}

		$content = $this->display( $content, $course_id, $post_id );

		if ( 'forum' === $post->post_type ) {
			return $original_content . $content;
		} else {
			return $content;
		}
	}

	// If on a course the $post_id will equal false. on a product it will equal an integer
	public function get_table( $courseOBJ, $specific_module = null, $course_id, $post_id ) {
		if ( $courseOBJ['total_items'] == 0 ) {
			return;
		}
		$course_permalink = get_permalink($post_id);
		ob_start();
		?>
		<table class="ui celled striped unstackable table">
			<thead>
				<tr>
					<?php
					if ( $specific_module ) {
						echo '<th colspan="3">Module Items</th>';
					} else {
						echo '<th colspan="3">Modules</th>';
					}
					?>
				</tr>
			</thead>
			<tbody>
				<?php
				if ( $specific_module && $courseOBJ[$specific_module]['items'] ) {
					foreach( $courseOBJ[$specific_module]['items'] as $pos => $value ) {
						$item_link = $course_permalink.$specific_module.'/'.$value['slug'];
						if ( 'video' == $value['type'] ) {
							$icon = 'film';
						} elseif( 'quiz' == $value['type'] ) {
							$icon = 'question';
						} else {
							$icon = 'file';
						}
						$state = $this->get_item_state( $course_id, $specific_module, $value['slug'] );
						$state_icon = false;
						if ( 'completed' === $state ) {
							$state_icon = "<i class='check circle icon'>";
						}
						echo "<tr data-item-slug='' data-state='$state'><td><i class='$icon icon'></i></td><td><a href='$item_link'>{$value['title']}</a></td><td class='right aligned'>$state_icon</td></tr>";
					}
				} else {
					foreach ($courseOBJ['modules'] as $key => $value) {
						echo "<tr><td colspan='3'><strong>$value</strong></td></tr>";
						$this_module = $key;
						foreach ($courseOBJ as $key => $value) {
							if ( $key !== "module_lookup" && $key !== 'modules' && $key === $this_module ) {
								if ($value['items']) {
									foreach( $value['items'] as $pos => $value ) {
										$item_link = $course_permalink.$this_module.'/'.$value['slug'];
										if ( 'video' == $value['type'] ) {
											$icon = 'film';
										} else {
											$icon = 'file';
										}
										echo "<tr data-item-slug=''><td><i class='$icon icon'></i></td><td><a href='$item_link'>{$value['title']}</a></td><td class='right aligned' data-completion-status></td></tr>";
									}
								}
							}
						}
					}
				}

				// Course Master Quiz
				if ( ! empty( get_field( 'quiz', $course_id ) ) && null === $specific_module ) {
					$quiz_state = '';
					$quiz_state_icon = false;
					if ( $quiz_state ) {
						$quiz_state_icon = '';
					}
					echo "<tr><td colspan='3'><strong>Quiz</strong></td></tr>";
					echo "<tr data-item-slug=''><td><i class='question icon'></i></td><td><a href='{$course_permalink}/quiz'>Quiz</a></td><td class='right aligned' data-completion-status>$quiz_state_icon</td></tr>";
				}

				if ( ! empty( $courseOBJ['downloads'] ) ) {
					echo "<tr><td colspan='3'><strong>Downloads</strong></td></tr>";
					foreach ($courseOBJ['downloads'] as $key => $value) {
						$icon = 'file alternate';
						if ( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' === $value->mime_type ) {
							$icon = 'file word';
						} elseif ( 'application/pdf' === $value->mime_type ) {
							$icon = 'file pdf';
						}
						echo '<tr><td><i class="'.$icon.' icon"></i></td><td colspan="2"><a href="' . $value->url . '" download>' . $value->title . '</a></td></tr>';
					}
				}

				?>
			</tbody>
		</table>
		<?php
		return ob_get_clean();
	}

	/**
	 * This handles all the actual course display on singular course pages.
	 * @param  [type] $content   [description]
	 * @param  [type] $course_id In the event that this course is being embedded in a Product or BBPress page then this would point to the course post id.
	 * @param  [type] $post_id   ^^ but for the actual post we're displaying.
	 * @return [type] $content  [description]
	 */
	public function display( $content, $course_id, $post_id ) {

		if ( ! is_singular( array( 'course', 'product', 'forum' ) ) ) {
			return $content;
		}

		if ( false === $this->current_course ) {
			return $content;
		}

		if ( false === $this->is_enrolled( $course_id )  ) {
			if ( is_user_logged_in() ) {
				$not_enrolled_message = '<div class="ui error message"><div class="header">You are not enrolled in this course</div><p>To view this course, enroll from the <a href="'.get_bloginfo('url').'/courses">curriculum listing.</a></p></div>';
			} else {
				$forms = new forms();
				$not_enrolled_message = '<div class="ui error message"><div class="header">Please login</div><p>To view this course you need to login, and enroll in this course.</p></div>';
				$not_enrolled_message .= $forms->login();
			}
			return apply_filters('easylms_unenrolled_content_message', $not_enrolled_message, $post_id);
		}

		global $wp_query;

		$item_slug = false;
		if ( isset( $wp_query->query_vars['itemSlug'] ) ) {
			$item_slug = $wp_query->query_vars['itemSlug'];
		}

		$module_slug = false;
		if ( isset( $wp_query->query_vars['moduleSlug'] ) ) {
			$module_slug = $wp_query->query_vars['moduleSlug'];
		}

		$is_quiz = false;
		if ( 'quiz' === $module_slug ) {
			$is_quiz = true;
			$quiz = new \EasyLMS\quiz();
		} else {
			$videos = new \EasyLMS\videos();
		}


		if ( false !== $item_slug ) {
			$item_type = $this->get_item_type_by_slug( $item_slug, $course_id );
			$item = $this->current_item;
		}

		$courseOBJ = $this->current_course;

		if ( true == $is_quiz ) {
			$content = $quiz->get_form( $course_id );
		} elseif ( false !== $item_slug && false !== $module_slug ) {
			// Presenting an item (video, note, blog post)
			if ( !is_int($item->ID) ) {
				$item_id = $item->ID;
			} else {
				$item_id = $item->ID;
			}
			if ( 'video' == $item_type ) {
				$content = $videos->get_inline_player($item_id, $course_id, $module_slug, $item_slug);
			} elseif( 'quiz' == $item_type ) {
				$quiz = new quiz();
				$content .= $quiz->get_form($course_id, $courseOBJ[$module_slug]['quiz_raw'], "true");
			} else {
				$text = $this->get_post_item($item_id, $course_id);
				$content = do_shortcode( wpautop( $text->post_content ) );
				$content .= '<div id="js-item-note"></div>';
			}
			$content .= $this->get_item_pagination($item_id, $course_id, $post_id, $module_slug);
		} elseif ( false === $item_slug && false !== $module_slug ) {
			// Present a module landing page
			$content = '<div class="ui divider"></div>' . $this->get_table($courseOBJ, $module_slug, $course_id, $post_id);
		} else {
			$content .= '<div class="ui divider"></div>' . $this->get_table($courseOBJ, null, $course_id, $post_id);
		}

		if ( false !== $module_slug && true == $courseOBJ[$module_slug]['prereq'] && 'complete' != $this->get_module_state( $course_id, $courseOBJ[$module_slug]['prev_module'] ) ) {
			$content = '<div class="ui negative message">
			<div class="header">
			<i class="lock icon"></i> This module is locked
			</div>
			<p>To access this module, complete the previous module</p></div>';
		}

		$content .= "<p><small><a href='http://www.easyteachlms.com' target='_blank'>Powered by EasyTeach LMS from Cliff Michaels & Associates</a></small></p>";

		return $content;
	}

}

$easyLMS_courses = new courses();
$easyLMS_courses->init();
