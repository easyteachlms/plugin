import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/certificate-student',
    {
        title: __('Student Name'),
        description: 'Student Name',
        category: 'education',
        keywords: [__('Student', 'Name')],
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
