/**
 * WordPress Dependencies
 */

import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import './style.scss';
import { ProvideCourse } from './context';
import CourseWrapper from './course-wrapper';

domReady(() => {
    const courses = document.querySelectorAll('.wp-block-easyteachlms-course');
    courses.forEach((course) => {
        const userId = course.getAttribute('data-user-id');
        const courseId = course.getAttribute('data-course-id');
        const certificate = course.querySelector('.wp-block-easyteachlms-certificate');
        certificate.remove();
        render(
            <ProvideCourse courseId={courseId} userId={userId}>
                <CourseWrapper>
                    {course.innerHTML}
                </CourseWrapper>
            </ProvideCourse>,
            course
        );
    });
});
