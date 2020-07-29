import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/certificate-date',
    {
        title: __('Completion Date'),
        description: 'Completion Date',
        category: 'education',
        keywords: [__('Student', 'Score', 'Date', 'Certificate')],
        supports: {
            html: false,
            align: false,
            multiple: false,
        },
        parent: ['easyteachlms/certificate'],
        edit,
        save,
    },
];

export default settings;
