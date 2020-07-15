import domReady from '@wordpress/dom-ready';
import { render, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const EnrollButton = ({ userId, courseId }) => {
    return (
        <a
            onClick={() => {
                apiFetch({
                    path: `/easyteachlms/v3/course/enroll/?userId=${userId}&courseId=${courseId}`,
                    method: 'POST',
                    data: { enrolled: true },
                }).then((res) => {
                    console.log(res);
                    setTimeout(() => {
                        console.log('ENROLLED');
                    }, 1000);
                });
            }}
        >
            Enroll
        </a>
    );
};

domReady(() => {
    console.log('enroll button!');
    const targets = document.querySelectorAll('.easyteachlms-enroll-button');
    targets.forEach((target) => {
        const userId = target.getAttribute('data-userId');
        const courseId = target.getAttribute('data-courseId');
        render(<EnrollButton userId={userId} courseId={courseId} />, target);
    });
});
