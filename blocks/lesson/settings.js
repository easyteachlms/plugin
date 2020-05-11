
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/lesson',
    {
        title: __('Lesson'), 
        description: 'Block Desc.',
        category: 'layout',
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
            lessonID: {
                type: 'integer', 
            },
            title: {
                type: 'string',
                default: "Lesson Title Here",
            }
        },
        edit,
        save,
    }
];

export default settings;