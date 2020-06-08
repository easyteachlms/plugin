<?php
class theme_compat {

	public function __construct() {

	}

	public function init() {
		add_filter( 'the_content', array($this, 'course_archive_enroll_link'), 10, 1 );
		add_shortcode( 'easylms_all_courses', array( $this, 'shortcode_all_courses' ) );

		// add_filter( 'next_post_link', array($this, 'adjacent_course_link_filter'), 10, 5 );
		// add_filter( 'previous_post_link', array($this, 'adjacent_course_link_filter'), 10, 5 );
	}

	public function theme_supports( $for = null ) {
		$supports = array(
			'pagination' => false,
			'breadcrumb' => false,
			'subtitle' => false,
			'course_archive_enroll' => false,
			'user_dashboard' => false,
		);
		if ( true == get_option( 'easylms_theme_support_pagination', false )  ) {
			$supports['pagination'] = true;
		}
		if ( true == get_option( 'easylms_theme_support_breadcrumb', false )  ) {
			$supports['breadcrumb'] = true;
		}
		if ( true == get_option( 'easylms_theme_support_subtitle', false )  ) {
			$supports['subtitle'] = true;
		}
		if ( true == get_option( 'easylms_theme_support_course_archive_enroll', false )  ) {
			$supports['course_archive_enroll'] = true;
		}
		if ( true == get_option( 'easylms_theme_support_user_dashboard', false )  ) {
			$supports['user_dashboard'] = true;
		}
		if ( isset( $for ) ) {
			return $supports[$for];
		}
		return $supports;
	}

	public function get_enroll_link( $post_id ) {
		$courses = new \EasyLMS\courses();
		if ( true === $courses->is_enrolled( $post_id ) ) {
			return '<a href="" data-enrolled-in-course="'.esc_attr( $post_id ).'"><i class="check green circle icon"></i> <span>Enrolled</span></a>';
		} else {
			return '<a href="" data-enroll-in-course="'.esc_attr( $post_id ).'"><i class="plus circle icon"></i> <span>Enroll</span></a>';
		}
	}

	public function course_archive_enroll_link( $content ) {
		if ( is_post_type_archive('course') && false == $this->theme_supports('course_archive_enroll') ) {
			global $post;
			$content = $this->get_enroll_link( $post->ID ) . $content;
		}
		return $content;
	}

	public function get_course_title( $post_id ) {
		if ( 'course' !== get_post_type( $post_id ) && ! is_singular() ) {
			return;
		}

		$courses = new \EasyLMS\courses();

		ob_start();
		global $wp_query;
		$courseOBJ = $courses->get_course_object( $post_id );

		$item_slug = false;
		if ( isset( $wp_query->query_vars['itemSlug'] ) ) {
			$item_slug = $wp_query->query_vars['itemSlug'];
			$item_type = $courses->get_item_type_by_slug($item_slug, $post_id);
			if ($item_type == 'note') {
				$item = $courses->get_post_item( $item_slug, $post_id );
			} else {
				$item = get_page_by_path( $item_slug, OBJECT, array( 'video','post' ) );
			}
		}

		$module_slug = false;
		if ( isset( $wp_query->query_vars['moduleSlug'] ) ) {
			$module_slug = $wp_query->query_vars['moduleSlug'];
		}

		echo $this->get_breadcrumb( $post_id, $item_slug, $module_slug, $courseOBJ );

		echo $this->get_enroll_link( $post_id );

		if ( false === $item_slug && 'quiz' === $module_slug ) {
			echo '<h1 class="quiz-title">Quiz</h1>';
		} elseif ( false === $item_slug && false !== $module_slug ) {
			echo "<h1 class='module-title'>{$courseOBJ[$module_slug]['title']}</h1>";
		} elseif( false !== $item_slug && false !== $module_slug ) {
			echo "<h3 class='item-title'>{$item->post_title}</h3>";
		} else {
			the_title('<h1 class="course-title">','</h1>');
		}
		return ob_get_clean();
	}

    public function get_breadcrumb($course_id, $item_slug, $module_slug, $courseOBJ) {
        if ( empty( $course_id ) ) {
            return false;
        } else {
			global $post;
		}

		$courses = new \EasyLMS\courses();

		$item_type = $courses->get_item_type_by_slug($item_slug, $course_id);
		if ($item_type == 'note') {
			$item = $courses->get_post_item( $item_slug, $course_id );
		} else {
			$item = get_page_by_path( $item_slug, OBJECT, array( 'video','post' ) );
		}

        ob_start();
        ?>
        <div class="ui breadcrumb">
            <a href="<?php echo get_bloginfo('url');?>/courses" class="section">Courses</a>
            <div class="divider"> / </div>
            <a href="<?php echo get_permalink($course_id);?>" class="section"><?php echo $post->post_title;?></a>

			<?php if ( false == $item_slug && 'quiz' === $module_slug ) { ?>
            <div class="divider"> / </div>
            <div class="section">Quiz</div>
            <?php } ?>

            <?php if ( false == $item_slug && false != $module_slug ) { ?>
            <div class="divider"> / </div>
            <div class="section"><?php echo $courseOBJ[$module_slug]['title'];?></div>
            <?php } ?>

            <?php if ( false != $item_slug && false != $module_slug ) { ?>
            <div class="divider"> / </div>
            <a href="<?php echo get_permalink($course_id) . $module_slug;?>" class="section"><?php echo $courseOBJ[$module_slug]['title'];?></a>
            <div class="divider"> / </div>
            <div class="active section"><?php echo $item->post_title;?></div>
            <?php } ?>

        </div>
        <?php
        return ob_get_clean();
    }

	public function get_course_card( $course_id = null, $cards = false, $excerpt = false ) {
		if ( null == $course_id ) {
			return;
		}
		$course = get_post( $course_id );
		if ( ! $course ) {
			return;
		}
		$permalink = get_permalink( $course_id );
		ob_start();
		if ( true === $cards ) {
			$class = 'fluid link card';
		} else {
			$class = 'ui fluid link card';
		}
		?>
		<div data-course-id="<?php echo esc_attr( $course_id ); ?>" class="<?php echo esc_attr( $class ); ?>">
				<a href="<?php echo esc_url( $permalink ); ?>" class="image">
					<?php echo get_the_post_thumbnail( $course_id, 'medium' );?>
				</a>
			<div class="content">
				<a href="<?php echo esc_url( $permalink ); ?>" class="header"><?php echo $course->post_title; ?></a>
				<div class="meta">
					<?php echo $this->get_enroll_link( $course_id );?>
				</div>
				<?php if ( true === $excerpt ) {
					echo get_the_excerpt($course_id);
				} ?>
			</div>
			<div class="extra content">
				<div class="ui small progress" data-percent="0">
					<div class="bar">
						<div class="progress"></div>
					</div>
					<div class="label" style="text-align:left;">Your Progress</div>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	public function get_navigation_accordion( $course_id, $inverted = true, $inverted_color = false ) {
		// check for if this is a product that has a linked course and then display accordingly
		if ( ! $course_id && ! is_singular( array( 'course', 'product', 'forum' ) ) ) {
			return;
		} else {
			if ( is_singular( array( 'product','forum' ) ) ) {
				global $post;
				$permalink_id = $post->ID;
			}
			$post = get_post( $course_id );
		}
		$inverted_class = '';
		if ( true == $inverted ) {
			$inverted_class = 'inverted';
		}
		if ( false !== $inverted_color ) {
			$inverted_class .= ' '. $inverted_color;
		}
		// Data about current video and current module
		global $wp_query;
		$current_item_slug = false;
		if ( isset( $wp_query->query_vars['itemSlug'] ) ) {
			$current_item_slug = $wp_query->query_vars['itemSlug'];
		}
		$current_module_slug = false;
		if ( isset( $wp_query->query_vars['moduleSlug'] ) ) {
			$current_module_slug = $wp_query->query_vars['moduleSlug'];
		}

		if ( is_singular('course') ) {
			$course_permalink = get_permalink($course_id);
		} elseif ( is_singular('product') ) {
			$course_permalink = get_permalink($permalink_id);
		} elseif ( is_singular('forum') ) {
			$course_permalink = get_permalink($permalink_id);
		}

		$courses = new \EasyLMS\courses();
		// Render
		ob_start();
		?>
		<div class="ui medium header"><a href="<?php echo esc_url($course_permalink); ?>"><?php echo $post->post_title; ?></a></div>
		<?php if ( is_singular('course') || is_singular('forum') ) {
			echo $this->get_enroll_link( $course_id );
		} ?>
		<div class="ui divider"></div>
		<div id="js-module-listing-progress" class="ui small <?php echo esc_attr( $inverted_class ); ?> progress" data-percent="0">
			<div class="bar">
				<div class="progress"></div>
			</div>
			<div class="label" style="text-align:left;">Course Progress</div>
		</div>
		<div class="ui divider"></div>
		<strong>Table of Contents</strong>
		<div id="js-module-listing-accordion" class="ui <?php echo esc_attr( $inverted_class ); ?> accordion">
			<?php
			$modules = $courses->current_course;
			foreach ($modules as $key => $value) {
				if ( $key !== "module_lookup" && $key !== 'modules' && $key !== 'downloads' && $key !== 'quiz' && $key !== 'total_items' ) {
					$module_title = $value['title'];
					$module_slug = $key;
					$display_items = true;
					$active_class = '';
					if ($current_module_slug == $module_slug) {
						$active_class = 'active';
					}
					//////////////
					echo '<div class="title '.$active_class.'">';
					echo '<i class="dropdown icon"></i>'.$module_title;
					echo '</div>';
					//////////////
					echo '<div class="content '.$active_class.'" data-module="'.$module_slug.'">';


					if ( true == $value['prereq'] && 'complete' != $courses->get_module_state( $course_id, $value['prev_module'] ) ) {
						?>
						<div class="ui negative message">
							<div class="header">
							<i class="lock icon"></i> This module is locked
							</div>
							<p>To access this module, complete the previous module</p>
						</div>
						<?php
						$display_items = false;
					}

					if ( $value['items'] ) {
						echo '<div class="ui vertical fluid ' . esc_attr( $inverted_class ) . ' menu">';
						foreach( $value['items'] as $pos => $value ) {
							$item_class = 'item';
							if ($current_item_slug === $value['slug']) {
								$item_class .= ' active';
							}
							$item_link = $course_permalink.$module_slug.'/'.$value['slug'];
							if ( $courses->get_item_state( $course_id, $module_slug, $value['slug'] ) ) {
								$state = $courses->get_item_state( $course_id, $module_slug, $value['slug'] );
								if ( 'completed' === $state ) {
									echo "<a class='$item_class completed' href='$item_link'><i class='check circle icon'></i> {$value['title']}</a>";
								} elseif( 'watched' === $state ) {
									echo "<a class='$item_class watched' href='$item_link'><i class='circle outline icon'></i> {$value['title']}</a>";
								}
							} else {
								echo "<a class='$item_class' href='$item_link'>{$value['title']}</a>";
							}
						}
						echo "<a class='item' href='{$course_permalink}{$module_slug}'><i class='grid layout icon'></i> View All</a>";
						echo '</div>'; // .menu
					}
					echo '</div>'; // .content
					//////////////
				}
			}
			if ( get_field( 'quiz', $course_id ) ) {
				echo '<div id="js-module-listing-quiz-link" class="title"><a href="'.$course_permalink.'/quiz"><i class="question icon"></i> Quiz</a></div>';
			}
			?>
		</div><!-- /.ui.accordion -->
		<?php
		return ob_get_clean();
	}

	public function add_title_extras( $title, $post_id ) {
		if ( is_admin() || true == $this->theme_supports('subtitle') || ! is_singular('course') ) {
			return $title;
		}

		global $wp_query;

		if ( false == $this->current_course ) {
			$courseOBJ = $this->get_course_object( $post_id );
		} else {
			$courseOBJ = $this->current_course;
		}

		$item_slug = false;
		if ( false !== $this->current_item_slug ) {
			$item_slug = $this->current_item_slug;
			$item_type = $this->get_item_type_by_slug( $item_slug, $post_id );
			if ( $item_type == 'note' ) {
				$item = $this->get_post_item( $item_slug, $post_id );
			} else {
				$item = get_page_by_path( $item_slug, OBJECT, array( 'video','post' ) );
			}
		}

		$module_slug = false;
		if ( false !== $this->current_module_slug ) {
			$module_slug = $this->current_module_slug;
		}

		$title = $title . '<br><small>' . $this->current_item->post_title . '</small>';

		return $title;
	}

	//TODO: finish this shortcode and when active add paged support to the page.
	//TODO: This should also have a little header area with the user info like heres your most recently accessed course with a button to open the video you last left off on.
	public function shortcode_all_courses( $attr ) {
		$attr = shortcode_atts(
			array(
				'cards' => false,
				'categories' => false, // Or if you pass in a comma seperated list of category slugs we will fetch only those slugs.
				'per_page' => 25,
			),
			$attr,
			'easylms_all_courses'
		);

		$args = array(
			'post_type' => 'course',
			'posts_per_page'
		);
		$the_query = new \WP_Query( $args );

		ob_start();
		if ( "true" === $attr['cards'] ) {
			echo '<div class="ui cards easylms-my-courses-list">';
		} else {
			echo '<div class="ui items">';
		}
		// The Loop
		if ( $the_query->have_posts() ) {
			while ( $the_query->have_posts() ) {
				$the_query->the_post();
				if ( "true" === $attr['cards'] ) {
					// echo $this->get_course_card( get_the_ID(), true, true );
				} else {
					echo '<div class="ui item">';
					the_title();
					echo '</div>';
				}
			}
			/* Restore original Post Data */
			wp_reset_postdata();
		} else {
			// no posts found
		}
		echo '</div>';
		$output = ob_get_clean();
		$output = apply_filters( 'easylms_shortcode_all_courses', $output );
		return $output;
	}

	// ::::::::::::::::::::::::::::::
	// ::::::::::::::::::::::::::::::
	// :::::::: Not Finished ::::::::
	// ::::::::::::::::::::::::::::::
	// ::::::::::::::::::::::::::::::
	public function adjacent_course_link_filter( $output, $link, $title, $post, $adjacent ) {
		global $post;

		if ( 'course' !== $post->post_type || true == $this->theme_supports( 'pagination' ) ) {
			return $output;
		}

		$courses = new \EasyLMS\courses();

		$original_output = $output;
		$output = '';

		if ( 'next' === $adjacent ) {
			$link = $courses->get_next_item($courses->current_item->ID, $courses->current_course_id, $courses->current_module_slug);
			if ( false !== $link ) {
				$output = '<div class="nav-next"><a href="'.$link['url'].'" rel="next"><span class="screen-reader-text">Forward</span><span aria-hidden="true" class="nav-subtitle">Forward</span> <span class="nav-title">'.$link['title'].'<span class="nav-title-icon-wrapper"><svg class="icon icon-arrow-right" aria-hidden="true" role="img"> <use href="#icon-arrow-right" xlink:href="#icon-arrow-right"></use> </svg></span></span></a></div>';
			}
		} elseif ( 'previous' === $adjacent ) {
			$link = $courses->get_prev_item($courses->current_item->ID, $courses->current_course_id, $courses->current_module_slug);
			if ( false !== $link ) {
				$output = '<div class="nav-previous"><a href="'.$link['url'].'" rel="prev"><span class="screen-reader-text">Back</span><span aria-hidden="true" class="nav-subtitle">Back</span> <span class="nav-title"><span class="nav-title-icon-wrapper"><svg class="icon icon-arrow-left" aria-hidden="true" role="img"> <use href="#icon-arrow-left" xlink:href="#icon-arrow-left"></use> </svg></span>'.$link['title'].'</a></div>';
			}
		}

		return $output;
	}
}

$theme_compat = new theme_compat();
add_action('init', array( $theme_compat, 'init' ) );


////////////////////////////////////////////////////
///////////////////// WIDGETS //////////////////////
////////////////////////////////////////////////////
/**
 * The course navigation and progress widget.
 */
class Course_Navigation_Widget extends \WP_Widget {

	/**
	* Register widget with WordPress
	*/
	function __construct() {
		parent::__construct(
			'coursenavigation_widget', // Base ID
			esc_html__( 'Course Navigation', 'textdomain' ), // Name
			array( 'description' => esc_html__( 'Provides an accordion for which to navigate through a course.', 'textdomain' ), ) // Args
		);
	}

	/**
	* Widget Fields
	*/
	private $widget_fields = array(
	);

	/**
	* Front-end display of widget
	*/
	public function widget( $args, $instance ) {
		if ( ! is_singular( array( 'course', 'product' ) ) ) {
			return;
		}

		global $post;

		$course_id = false;
		if ( is_singular('course') ) {
			$course_id = $post->ID;
		} else {
			$course_id = get_post_meta( $post->ID, '_linked_course', true );
		}

		if ( false == $course_id ) {
			return;
		}

		$theme_compat = new \theme_compat();

		echo $args['before_widget'];

		// Output widget title
		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		echo $theme_compat->get_navigation_accordion( $course_id, false );

		echo $args['after_widget'];
	}

	/**
	* Back-end widget fields
	*/
	public function field_generator( $instance ) {
		$output = '';
		foreach ( $this->widget_fields as $widget_field ) {
			$widget_value = ! empty( $instance[$widget_field['id']] ) ? $instance[$widget_field['id']] : esc_html__( $widget_field['default'], 'textdomain' );
			switch ( $widget_field['type'] ) {
				default:
					$output .= '<p>';
					$output .= '<label for="'.esc_attr( $this->get_field_id( $widget_field['id'] ) ).'">'.esc_attr( $widget_field['label'], 'textdomain' ).':</label> ';
					$output .= '<input class="widefat" id="'.esc_attr( $this->get_field_id( $widget_field['id'] ) ).'" name="'.esc_attr( $this->get_field_name( $widget_field['id'] ) ).'" type="'.$widget_field['type'].'" value="'.esc_attr( $widget_value ).'">';
					$output .= '</p>';
			}
		}
		echo $output;
	}

	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( '', 'textdomain' );
		?>
		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'textdomain' ); ?></label>
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>
		<?php
		$this->field_generator( $instance );
	}

	/**
	* Sanitize widget form values as they are saved
	*/
	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		foreach ( $this->widget_fields as $widget_field ) {
			switch ( $widget_field['type'] ) {
				case 'checkbox':
					$instance[$widget_field['id']] = $_POST[$this->get_field_id( $widget_field['id'] )];
					break;
				default:
					$instance[$widget_field['id']] = ( ! empty( $new_instance[$widget_field['id']] ) ) ? strip_tags( $new_instance[$widget_field['id']] ) : '';
			}
		}
		return $instance;
	}
} // class Course_Navigation_Widget

/**
 * The My Courses Widget
 */
class My_Courses_Widget extends \WP_Widget {

	/**
	* Register widget with WordPress
	*/
	function __construct() {
		parent::__construct(
			'mycourses_widget', // Base ID
			esc_html__( 'My Courses', 'textdomain' ), // Name
			array( 'description' => esc_html__( 'Displays the logged in users courses. If the user is not logged in presents a login form.', 'textdomain' ), ) // Args
		);
	}

	/**
	* Widget Fields
	*/
	private $widget_fields = array(
	);

	/**
	* Front-end display of widget
	*/
	public function widget( $args, $instance ) {

		global $post;
		$forms = new \EasyLMS\forms();

		echo $args['before_widget'];

		// Output widget title
		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		$current_user = wp_get_current_user();

		if ( ! is_user_logged_in() ) {
			echo $forms->login();
		} else {
			$my_courses = get_user_meta( $current_user->data->ID, '_enrolled_courses', true );
			if ( is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
				$my_courses = get_user_meta( $current_user->data->ID, '_purchased_courses', true );
			}
			$i = 1;
			if ( empty( $my_courses ) ) {
				echo '<p><a href="'.get_bloginfo( 'url' ).'/courses" class="ui button">Enroll in your first course</a></p>';
				return;
			}

			echo '<div class="ui divided items easylms-my-courses-list">';
			foreach ($my_courses as $course_id) {
				if ( $i <= 4 ) {
					$permalink_id = $course_id;
					if ( class_exists( 'WooCommerce' ) ) {
						$course_id = get_post_meta( $course_id, '_linked_course', true );
					}
					?>
					<div class="item" data-course-id="<?php echo $course_id; ?>">
						<div class="content">
							<a class="header" href="<?php echo get_permalink($permalink_id); ?>"><?php echo get_the_title($permalink_id);?></a>
							<div class="extra">
								<div class="ui small progress" data-percent="0">
									<div class="bar">
										<div class="progress"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<?php
				}
				$i++;
			}
			echo '<a class="item" href="'.get_bloginfo('url').'/user/dashboard">View All Your Courses</a>';
			echo '</div>';
		}

		echo $args['after_widget'];
	}

	/**
	* Back-end widget fields
	*/
	public function field_generator( $instance ) {
		$output = '';
		foreach ( $this->widget_fields as $widget_field ) {
			$widget_value = ! empty( $instance[$widget_field['id']] ) ? $instance[$widget_field['id']] : esc_html__( $widget_field['default'], 'textdomain' );
			switch ( $widget_field['type'] ) {
				default:
					$output .= '<p>';
					$output .= '<label for="'.esc_attr( $this->get_field_id( $widget_field['id'] ) ).'">'.esc_attr( $widget_field['label'], 'textdomain' ).':</label> ';
					$output .= '<input class="widefat" id="'.esc_attr( $this->get_field_id( $widget_field['id'] ) ).'" name="'.esc_attr( $this->get_field_name( $widget_field['id'] ) ).'" type="'.$widget_field['type'].'" value="'.esc_attr( $widget_value ).'">';
					$output .= '</p>';
			}
		}
		echo $output;
	}

	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( '', 'textdomain' );
		?>
		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'textdomain' ); ?></label>
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>
		<?php
		$this->field_generator( $instance );
	}

	/**
	* Sanitize widget form values as they are saved
	*/
	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		foreach ( $this->widget_fields as $widget_field ) {
			switch ( $widget_field['type'] ) {
				case 'checkbox':
					$instance[$widget_field['id']] = $_POST[$this->get_field_id( $widget_field['id'] )];
					break;
				default:
					$instance[$widget_field['id']] = ( ! empty( $new_instance[$widget_field['id']] ) ) ? strip_tags( $new_instance[$widget_field['id']] ) : '';
			}
		}
		return $instance;
	}
} // class My_Courses_Widget



// Specific Theme Support

class wp_charming_compat {

	public function __construct() {
		if ( function_exists('wpcharming_setup') ) {
			add_action( 'save_post_course', array( $this, 'post_meta'), 10, 3 );
			add_action( 'easylms_user_dashboard_header', array( $this, 'user_dashboard_welcome' ) );
			add_filter( 'get_the_archive_title', array( $this, 'archive_title_filter'), 100, 1 ) ;
		}
	}

	public function post_meta( $post_id, $post, $update  ) {
		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}
		if ( ! empty( get_post_thumbnail_id( $post_id ) ) ) {
			$img  = wp_get_attachment_image_src( $post_id, 'full' );
			// Titles.
			update_post_meta( $post_id, '_wpc_header_title', $post->post_title ); // string
			update_post_meta( $post_id, '_wpc_header_subtitle', $post->post_excerpt ); // string
			// Cosmetic.
			update_post_meta( $post_id, '_wpc_enable_page_header', 'on' ); // "on" or "off"
			update_post_meta( $post_id, '_wpc_header_alignment', 'left' ); // "left" or "right" or "center" controls the text alignment
			update_post_meta( $post_id, '_wpc_header_bg', $img[0] ); // image url
			update_post_meta( $post_id, '_wpc_header_padding_top', '100px' ); // number
			update_post_meta( $post_id, '_wpc_header_padding_bottom', '80px' ); // number
			update_post_meta( $post_id, '_wpc_header_parallax', 'on' ); // "on" or "off"
			update_post_meta( $post_id, '_wpc_parallax_overlay', '#000000' ); // hex color code
			update_post_meta( $post_id, '_wpc_header_bg_color', '#E9E9E9' ); // hex color code
			update_post_meta( $post_id, '_wpc_header_text_color', '#FFF' ); // hex color code
		}
	}

	public function archive_title_filter( $title ) {
		if ( is_post_type_archive( 'course' ) ) {
			$title = 'Curriculum';
		}
		return $title;
	}

	public function user_dashboard_welcome() {
		$user = wp_get_current_user();
		$first_name = $user->user_firstname;
		echo '<h1>Welcome, ' . $first_name . '</h1>';
	}
}
new wp_charming_compat();
