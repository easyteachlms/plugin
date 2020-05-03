<?php
namespace EasyLMS;

class admin {
	public function __construct() {

	}
	public function init() {
		$this->register_fields();
		add_filter( 'acf/validate_value/name=video_source', array( $this, 'validate_video_src_field' ), 10, 4 );
		add_action( 'acf/init', array( $this, 'init_options_page' ) );
		add_action( 'add_meta_boxes', array( $this, 'remove_videos_from_yoast' ), 100000 );
	}
	public function register_fields() {
		$course_fields = array(
			'key' => 'group_5aaeb1a701bcb',
			'title' => 'Course Fields',
			'fields' => array(
				array(
					'key' => 'field_5aaeb4155a103',
					'label' => 'Modules',
					'name' => '',
					'type' => 'tab',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'placement' => 'top',
					'endpoint' => 0,
				),
				array(
					'key' => 'field_5aaeb42e5a104',
					'label' => 'Modules',
					'name' => 'modules',
					'type' => 'repeater',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'collapsed' => 'field_5aaeb45a5a107',
					'min' => 0,
					'max' => 0,
					'layout' => 'block',
					'button_label' => 'Add Module',
					'sub_fields' => array(
						array(
							'key' => 'field_5aaeb45a5a107',
							'label' => 'Title',
							'name' => 'title',
							'type' => 'text',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '70',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
							'maxlength' => '',
						),
						array(
							'key' => 'field_5ad2aa940cbe2',
							'label' => 'Prerequisite?',
							'name' => 'prerequisite',
							'type' => 'true_false',
							'instructions' => 'Make viewing this module dependent on completing the previous module.',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '30',
								'class' => '',
								'id' => '',
							),
							'message' => '',
							'default_value' => 0,
							'ui' => 0,
							'ui_on_text' => '',
							'ui_off_text' => '',
						),
						array(
							'key' => 'field_5ab7fcc2d1be7',
							'label' => 'Items',
							'name' => 'items',
							'type' => 'flexible_content',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'layouts' => array(
								'5ab7fcda57642' => array(
									'key' => '5ab7fcda57642',
									'name' => 'video',
									'label' => 'Video',
									'display' => 'row',
									'sub_fields' => array(
										array(
											'key' => 'field_5ab7fce6d1be9',
											'label' => 'Video',
											'name' => 'video',
											'type' => 'post_object',
											'instructions' => '',
											'required' => 0,
											'conditional_logic' => 0,
											'wrapper' => array(
												'width' => '',
												'class' => '',
												'id' => '',
											),
											'post_type' => array(
												0 => 'video',
											),
											'taxonomy' => array(
											),
											'allow_null' => 0,
											'multiple' => 0,
											'return_format' => 'object',
											'ui' => 1,
										),
									),
									'min' => '',
									'max' => '',
								),
								'5ab7fd04d1bea' => array(
									'key' => '5ab7fd04d1bea',
									'name' => 'note',
									'label' => 'Note',
									'display' => 'row',
									'sub_fields' => array(
										array(
											'key' => 'field_5ab7fd09d1beb',
											'label' => 'Title',
											'name' => 'title',
											'type' => 'text',
											'instructions' => '',
											'required' => 0,
											'conditional_logic' => 0,
											'wrapper' => array(
												'width' => '',
												'class' => '',
												'id' => '',
											),
											'default_value' => '',
											'placeholder' => '',
											'prepend' => '',
											'append' => '',
											'maxlength' => '',
										),
										array(
											'key' => 'field_5ab7fd0dd1bec',
											'label' => 'Note',
											'name' => 'note',
											'type' => 'wysiwyg',
											'instructions' => '',
											'required' => 0,
											'conditional_logic' => 0,
											'wrapper' => array(
												'width' => '',
												'class' => '',
												'id' => '',
											),
											'default_value' => '',
											'tabs' => 'all',
											'toolbar' => 'full',
											'media_upload' => 1,
											'delay' => 0,
										),
									),
									'min' => '',
									'max' => '',
								),
								'5ab86d4ef0acf' => array(
									'key' => '5ab86d4ef0acf',
									'name' => 'post',
									'label' => 'Post',
									'display' => 'row',
									'sub_fields' => array(
										array(
											'key' => 'field_5ab86d53f0ad0',
											'label' => 'Post',
											'name' => 'post',
											'type' => 'post_object',
											'instructions' => '',
											'required' => 0,
											'conditional_logic' => 0,
											'wrapper' => array(
												'width' => '',
												'class' => '',
												'id' => '',
											),
											'post_type' => array(
												0 => 'post',
											),
											'taxonomy' => array(
											),
											'allow_null' => 0,
											'multiple' => 0,
											'return_format' => 'object',
											'ui' => 1,
										),
									),
									'min' => '',
									'max' => '',
								),
							),
							'button_label' => 'Add Item',
							'min' => '',
							'max' => 50,
						),
						array(
							'key' => 'field_5qzmdlenable100d',
							'label' => 'Enable Module Quiz',
							'name' => 'enable_module_quiz',
							'type' => 'true_false',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'message' => '',
							'default_value' => 0,
							'ui' => 1,
							'ui_on_text' => 'True',
							'ui_off_text' => 'False',
						),
						array(
							'key' => 'field_5qzmdl4475a106',
							'label' => 'Quiz',
							'name' => 'quiz',
							'type' => 'repeater',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => array(
								array(
									array(
										'field' => 'field_5qzmdlenable100d',
										'operator' => '==',
										'value' => '1',
									),
								),
							),
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'collapsed' => '',
							'min' => 0,
							'max' => 0,
							'layout' => 'row',
							'button_label' => 'Add Question',
							'sub_fields' => array(
								array(
									'key' => 'field_5qzmdl4db5a10a',
									'label' => 'Question',
									'name' => 'question',
									'type' => 'text',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => '',
									'placeholder' => '',
									'prepend' => '',
									'append' => '',
									'maxlength' => '',
								),
								array(
									'key' => 'field_5qzmdl4e65a10b',
									'label' => 'Answers',
									'name' => 'answers',
									'type' => 'repeater',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'collapsed' => '',
									'min' => 0,
									'max' => 0,
									'layout' => 'table',
									'button_label' => 'Add Answer',
									'sub_fields' => array(
										array(
											'key' => 'field_5qzmdl4f85a10c',
											'label' => 'Answer Text',
											'name' => 'answer_text',
											'type' => 'text',
											'instructions' => '',
											'required' => 0,
											'conditional_logic' => 0,
											'wrapper' => array(
												'width' => '70',
												'class' => '',
												'id' => '',
											),
											'default_value' => '',
											'placeholder' => '',
											'prepend' => '',
											'append' => '',
											'maxlength' => '',
										),
										array(
											'key' => 'field_5qzmdl50b5a10d',
											'label' => 'True',
											'name' => 'true',
											'type' => 'true_false',
											'instructions' => '',
											'required' => 0,
											'conditional_logic' => 0,
											'wrapper' => array(
												'width' => '',
												'class' => '',
												'id' => '',
											),
											'message' => '',
											'default_value' => 0,
											'ui' => 1,
											'ui_on_text' => 'True',
											'ui_off_text' => 'False',
										),
									),
								),
							),
						),
					),
				),
				array(
					'key' => 'field_5aff0c35fa256',
					'label' => 'Downloads',
					'name' => '',
					'type' => 'tab',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'placement' => 'top',
					'endpoint' => 0,
				),
				array(
					'key' => 'field_5aff0c3cfa257',
					'label' => 'Downloads',
					'name' => 'downloads',
					'type' => 'repeater',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'collapsed' => '',
					'min' => 0,
					'max' => 0,
					'layout' => 'table',
					'button_label' => '',
					'sub_fields' => array(
						array(
							'key' => 'field_5aff0c63fa259',
							'label' => 'File',
							'name' => 'file',
							'type' => 'file',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'return_format' => 'array',
							'library' => 'all',
							'min_size' => '',
							'max_size' => '',
							'mime_types' => 'pdf,doc, docx,xls,xlsx',
						),
					),
				),
				array(
					'key' => 'field_5aaeb43a5a105',
					'label' => 'Quiz',
					'name' => '',
					'type' => 'tab',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'placement' => 'top',
					'endpoint' => 0,
				),
				array(
					'key' => 'field_5acqzpsb81e94021',
					'label' => 'Passing Grade',
					'name' => 'passing_grade',
					'type' => 'text',
					'instructions' => 'What percentage should <strong>all</strong> quizzes (course or module based quizzes) pass at?',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'message' => '',
					'default_value' => '70',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
				array(
					'key' => 'field_5aaeb81e74062',
					'label' => 'Randomize Answers',
					'name' => 'randomize_answers',
					'type' => 'true_false',
					'instructions' => 'When selected all quiz answers order will be randomized',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'message' => '',
					'default_value' => 0,
					'ui' => 0,
					'ui_on_text' => '',
					'ui_off_text' => '',
				),
				array(
					'key' => 'field_5aceeb81e94021',
					'label' => 'Require Completion of All Modules?',
					'name' => 'prereq_quiz',
					'type' => 'true_false',
					'instructions' => 'If selected the student will be required to complete all modules in this course before making the quiz available.',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'message' => '',
					'default_value' => 0,
					'ui' => 0,
					'ui_on_text' => '',
					'ui_off_text' => '',
				),
				array(
					'key' => 'field_5aaeb4475a106',
					'label' => 'Quiz',
					'name' => 'quiz',
					'type' => 'repeater',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'collapsed' => '',
					'min' => 0,
					'max' => 0,
					'layout' => 'row',
					'button_label' => 'Add Question',
					'sub_fields' => array(
						array(
							'key' => 'field_5aaeb4db5a10a',
							'label' => 'Question',
							'name' => 'question',
							'type' => 'text',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
							'maxlength' => '',
						),
						array(
							'key' => 'field_5aaeb4e65a10b',
							'label' => 'Answers',
							'name' => 'answers',
							'type' => 'repeater',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'collapsed' => '',
							'min' => 0,
							'max' => 0,
							'layout' => 'table',
							'button_label' => 'Add Answer',
							'sub_fields' => array(
								array(
									'key' => 'field_5aaeb4f85a10c',
									'label' => 'Answer Text',
									'name' => 'answer_text',
									'type' => 'text',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '70',
										'class' => '',
										'id' => '',
									),
									'default_value' => '',
									'placeholder' => '',
									'prepend' => '',
									'append' => '',
									'maxlength' => '',
								),
								array(
									'key' => 'field_5aaeb50b5a10d',
									'label' => 'True',
									'name' => 'true',
									'type' => 'true_false',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'message' => '',
									'default_value' => 0,
									'ui' => 1,
									'ui_on_text' => 'True',
									'ui_off_text' => 'False',
								),
							),
						),
					),
				),
				array(
					'key' => 'field_5aaeb1b35a0ff',
					'label' => 'Meta',
					'name' => '',
					'type' => 'tab',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'placement' => 'top',
					'endpoint' => 0,
				),
				array(
					'key' => 'field_5aaeb1c45a100',
					'label' => 'Given By',
					'name' => 'given_by',
					'type' => 'text',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
				array(
					'key' => 'field_5aaeb1d05a101',
					'label' => 'Instructors',
					'name' => 'instructors',
					'type' => 'text',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
			),
			'location' => array(
				array(
					array(
						'param' => 'post_type',
						'operator' => '==',
						'value' => 'course',
					),
				),
			),
			'menu_order' => 0,
			'position' => 'normal',
			'style' => 'default',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen' => '',
			'active' => 1,
			'description' => '',
		);
		$options_fields = array(
			'key' => 'group_5b31b5373594c',
			'title' => 'Certificate Options',
			'fields' => array(
				array(
					'key' => 'field_5b31b5db236d5',
					'label' => 'Certificate Template',
					'name' => 'certificate_template',
					'type' => 'wysiwyg',
					'instructions' => 'You can use shortcodes like [course_title], [first_name], [last_name], and [date] to format your certificate.',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'tabs' => 'all',
					'toolbar' => 'full',
					'media_upload' => 1,
					'delay' => 1,
				),
			),
			'location' => array(
				array(
					array(
						'param' => 'options_page',
						'operator' => '==',
						'value' => 'acf-options-easylms-options',
					),
				),
			),
			'menu_order' => 0,
			'position' => 'normal',
			'style' => 'default',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen' => '',
			'active' => 1,
			'description' => '',
		);
		acf_add_local_field_group( $course_fields );
		acf_add_local_field_group( $options_fields );
		// if Woocommerce or Bbpress active
		$course_linking_fields = array(
			'key' => 'group_5b900fa4b44dc',
			'title' => 'Course Linking',
			'fields' => array(
				array(
					'key' => 'field_5b901473f76cd',
					'label' => 'Linked Course',
					'name' => '_linked_course',
					'type' => 'post_object',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'post_type' => array(
						0 => 'course',
					),
					'taxonomy' => array(
					),
					'allow_null' => 0,
					'multiple' => 0,
					'return_format' => 'id',
					'ui' => 1,
				),
			),
			'location' => array(
				array(
					array(
						'param' => 'post_type',
						'operator' => '==',
						'value' => 'forum',
					),
				),
				array(
					array(
						'param' => 'post_type',
						'operator' => '==',
						'value' => 'product',
					),
				),
			),
			'menu_order' => 0,
			'position' => 'normal',
			'style' => 'default',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen' => '',
			'active' => 1,
			'description' => '',
		);
		acf_add_local_field_group( $course_linking_fields );
	}
	public function validate_video_src_field( $valid, $value, $field, $input ){
		// bail early if value is already invalid
		if( ! $valid ) {
			return $valid;
		}

		if ( strpos($value,'vimeo') == false && strpos($value,'youtube') == false && strpos($value,'youtu.be') == calse ) {
			$valid = 'The video must be from Vimeo or YouTube';
		}

		// return
		return $valid;
	}

	public function init_options_page() {
		if( function_exists('acf_add_options_page') ) {
			acf_add_options_page('EasyLMS Options');
		}
	}

	// If some poor soul is still using Yoast SEO: I recommend - https://wordpress.org/plugins/autodescription/
	public function remove_videos_from_yoast() {
		remove_meta_box( 'wpseo_meta', 'video', 'normal' );
	}

}

$easyLMS_admin = new admin();
$easyLMS_admin->init();
