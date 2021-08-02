/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';

const doEnrollment = (userId, courseId) => {
    apiFetch({
        path: `/easyteachlms/v4/course/enroll/?userId=${userId}&courseId=${courseId}`,
        method: 'POST',
        data: { enrolled: true },
    })
    .then(() => {
        setTimeout(() => {
            window.location.href = window.location.href;
        }, 1000);
    })
    .catch((e) => {
        // Handle if the user is not logged in, redirect them to login and tell wp-login what course to redirec to after you're enrolled.
        if ('rest_forbidden' === e.code) {
            apiFetch({
                path: `/easyteachlms/v4/course/redirect-to-login/?courseId=${courseId}`,
                method: 'GET',
            }).then((url) => {
                window.location.href = url;
            });
        }
    });
}
 
domReady(() => {
    const targets = document.querySelectorAll('.js-enroll-in-course-button');
    targets.forEach((target) => {
        const userId = target.getAttribute('data-user-id');
        const courseId = target.getAttribute('data-course-id');
        target.addEventListener('click', ()=> {
            doEnrollment(userId, courseId);
        });
    });
});
 