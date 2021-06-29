/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const EnrollButton = ({ enrolled, userId, courseId, link }) => {
    const [success, enroll] = useState(enrolled);

    return (
        <a
            onClick={() => {
                if (false === success) {
                    apiFetch({
                        path: `/easyteachlms/v3/course/enroll/?userId=${userId}&courseId=${courseId}`,
                        method: 'POST',
                        data: { enrolled: true },
                    }).then((res) => {
                        setTimeout(() => {
                            enroll(true);
                        }, 1000);
                    });
                } else {
                    window.location.href = link;
                }
            }}
            style={{
                cursor: 'pointer',
            }}
        >
            {false === success && 'Enroll'}
            {true === success && 'View Course'}
        </a>
    );
};

domReady(() => {
    const targets = document.querySelectorAll('.easyteachlms-enroll-button');
    targets.forEach((target) => {
        const props = {
            userId: target.getAttribute('data-userId'),
            courseId: target.getAttribute('data-courseId'),
            link: target.getAttribute('data-courseLink'),
            enrolled: 'true' === target.getAttribute('data-enrolled'),
        };
        render(<EnrollButton {...props} />, target);
    });
});
