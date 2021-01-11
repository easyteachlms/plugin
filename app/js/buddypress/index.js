import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { getPath } from '@wordpress/url';
import ViewStudentProgressButton from './student-overview';
import ViewStudentNotifications from './student-notifications';

const getVarInQuery = (item, str) => {
    let items;
    if (!str) return false;
    const data_fields = str.split('&');
    for (let i = 0; i < data_fields.length; i++) {
        items = data_fields[i].split('=');
        if (items[0] == item) return items[1];
    }

    return false;
};

const getUserSlugFromURL = (url) => {
    const parts = url.split('/');
    return parts[4];
};

const initStudentProgressButton = () => {
    setTimeout(() => {
        const viewStudentButtons = document.querySelectorAll(
            '.view-student-progress-button',
        );
        const studentNotifications = document.querySelectorAll(
            '.view-student-notification-button',
        );

        viewStudentButtons.forEach((target) => {
            const url = target.parentElement.parentElement.parentElement
                .querySelector('.list-title.member-name > a')
                .getAttribute('href');
            const props = {
                userSlug: getUserSlugFromURL(url),
                groupId: target.getAttribute('data-group-id'),
            };
            render(<ViewStudentProgressButton {...props} />, target);
        });

        studentNotifications.forEach((target) => {
            const url = target.parentElement.parentElement.parentElement
                .querySelector('.list-title.member-name > a')
                .getAttribute('href');
            const props = {
                userSlug: getUserSlugFromURL(url),
                groupId: target.getAttribute('data-group-id'),
            };
            // get student notification in promise and if it succeeds render otherwise dont.
            render(<ViewStudentNotifications {...props} />, target);
        });
    }, 1000);
};

domReady(() => {
    // eslint-disable-next-line no-undef
    console.log('init buttons');
    jQuery(document).ajaxComplete((evt, xhr, options) => {
        const action = getVarInQuery('action', options.data);
        console.log(action);
        // switch
        // eslint-disable-next-line default-case
        switch (action) {
            case 'members_filter':
                initStudentProgressButton();
                break;
        }
    });
});
