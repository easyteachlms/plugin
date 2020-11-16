import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import ViewStudentProgressButton from './student-overview';

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

const initStudentProgressButton = () => {
    setTimeout(() => {
        const targets = document.querySelectorAll(
            '.view-student-progress-button',
        );

        targets.forEach((target) => {
            console.log(target);
            const props = {
                userId: target.getAttribute('data-user-id'),
                groupId: target.getAttribute('data-group-id'),
            };
            render(<ViewStudentProgressButton {...props} />, target);
        });
    }, 1000);
};

domReady(() => {
    jQuery(document).ajaxComplete((evt, xhr, options) => {
        const action = getVarInQuery('action', options.data);
        console.log(action);
        // switch
        switch (action) {
            case 'members_filter':
                console.log('members_filter was posted');
                initStudentProgressButton();
                break;
        }
    });
});
