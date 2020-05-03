<?php

/**
 * Course structure should be added as post meta to the course.
 * Whenever a topic is added to a lesson the topic should have post meta that should list the post id's of the lessons where it can be found.
 * Whenever a lesson is added to a course the lesson should have post meta that lists the ids of the courses where it can be found.
 */
class Data_Model extends EasyTeachLMS {
	public function __construct() {

	}
	public function get_course_structure( int $post_id ) {
		$structure = array();
		$strucure  = array(
			'title'    => 'Course Title Here',
			'lessons'  => 'lesson count here as integer',
			'topics'   => 'topics count here as integer',
			'enrolled' => 'the total number of students currently enrolled in this course?',
			'points'   => 'should we have a numerical points value for the course on "completion" for a student???',
			'outline'  => array(
				'lesson_01' => array(
					'topic_01',
					'topic_02',
				),
				'lesson_02' => array(
					'topic_01',
					'topic_02',
				),
			),
		);
		return $structure;
	}
	public function update_course_structure( int $post_id ) {

	}
	public function diff_course_structure( int $post_id ) {

	}
}
