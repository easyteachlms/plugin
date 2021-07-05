/**
 * WordPress Dependencies
 */

import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import './style.scss';
import CourseWrapper from './course-wrapper';

domReady(() => {
    const courses = document.querySelectorAll('.wp-block-easyteachlms-course');
    courses.forEach((course) => {
        const userId = course.getAttribute('data-user-id');
        const courseId = course.getAttribute('data-course-id');

        render(
            <CourseWrapper userId={userId} courseId={courseId}>
                {course.innerHTML}
            </CourseWrapper>,
            course
        );
    });
});
