import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/course',
    {
        title: __('Course'),
        description: 'Block Desc.',
        category: 'education',
        // styles: [
        //     {
        //         name: 'default',
        //         label: __('Default'),
        //         isDefault: true,
        //     },

        // ],
        keywords: [
            __('Course'),
            __('Easy Teach LMS'),
            __('LMS'),
            __('Learning'),
        ],
        supports: {
            html: false,
            align: false,
            multiple: false,
        },
        attributes: {
            id: {
                type: 'integer',
                default: 0,
            },
            description: {
                type: 'string',
                default: '',
            },
        },
        edit,
        save,
    },
];

export default settings;
