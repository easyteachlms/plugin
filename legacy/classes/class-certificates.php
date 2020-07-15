<?php
namespace EasyLMS;

class certificates {
	public $output = false;
	public function __construct() {

	}
	public function init() {
		add_action( 'wp_enqueue_scripts', array( $this, 'scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );
		add_shortcode( 'course_title', array($this, 'shortcode_course_title') );
		add_shortcode( 'first_name', array($this, 'shortcode_first_name') );
		add_shortcode( 'last_name', array($this, 'shortcode_last_name') );
		add_shortcode( 'date', array($this, 'shortcode_date') );
		add_action('wp_footer',array($this, 'generate'));
	}
	public function register_fields() {

	}
	public function scripts() {
		wp_enqueue_script( 'easylms-pdfgen' );
		wp_enqueue_script( 'easylms-certificates' );
		// wp_localize_script( 'easylms-certificates', 'template', array('json_encoded_template') );
	}
	public function add_preview_to_admin(){

	}
	public function shortcode_course_title() {
		global $post;
		return $post->post_title;
	}
	public function shortcode_first_name() {
		$user = wp_get_current_user();
		return $user->user_firstname;
	}
	public function shortcode_last_name() {
		$user = wp_get_current_user();
		return $user->user_lastname;
	}
	public function shortcode_date() {
		return date('l, F j, Y');
	}
	// This should output to a modal with an option to download or close.
	public function generate() {
		if ( ! is_singular( 'course' ) ) {
			return;
		}

		global $post;
		$uid = get_current_user_id();
		$quiz = new quiz();

		if ( true !== $quiz->did_pass_course( $post->ID ) ) {
			return;
		}

		$template     = get_field( 'certificate_template', 'options' );
		$this->output = $template;
		ob_start();
		?>
		<div id="js-activate-certificate-modal" class="ui modal">
			<div class="header">Download Certificate of Completion: <?php echo $post->post_title; ?></div>
			<div class="content">
				<div id="js-certificate"><?php echo $template; ?></div>
			</div>
			<div class="actions">
				<div class="ui approve button">Download</div>
				<div class="ui cancel button">Cancel</div>
			</div>
		</div>
		<?php
		echo ob_get_clean();
	}
}
$certificates = new certificates();
$certificates->init();
