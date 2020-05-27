
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/lesson',
    {
        title: __('Lesson'), 
        description: 'Block Desc.',
        category: 'education',
        // icon: {
        //     background: '#yourcolor',
        //     foreground: '#yourcolor',
        //     src: 'Dashicon',
        // },
        keywords: [
            __( 'Key 1' ),
            __( 'Key 2' ), 
            __( 'Key 3' )
        ],
        supports: {
            html: false, 
            align: true
        },
        attributes: {
            id: {
                type: 'integer', 
                default: 0,
            },
            lastUpdated: {
                type: 'string',
                default: '',
            },
            title: {
                type: 'string',
                default: '',
            }
        },
        edit,
        save,
    }
];

export default settings;