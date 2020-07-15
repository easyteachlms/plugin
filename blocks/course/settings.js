import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/course',
    {
        title: __('Course'),
        description: 'Block Desc.',
        category: 'education',
        // icon: {
        //     background: '#yourcolor',
        //     foreground: '#yourcolor',
        //     src: 'Dashicon',
        // },
        styles: [
            {
                name: 'default',
                label: __('Default'),
                isDefault: true,
            },
            // {
            //     name: 'mini',
            //     label: __('Mini'),
            // },
            // {
            //     name: 'full-screen',
            //     label: __('Full Screen'),
            // },
        ],
        keywords: [
            __('Course'),
            __('Easy Teach LMS'),
            __('LMS'),
            __('Learning'),
            ,
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
            welcomeDisabled: {
                type: 'boolean',
                default: false,
            },
        },
        edit,
        save,
    },
];

export default settings;
