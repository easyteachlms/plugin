
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/topic',
    {
        title: __('Topic'), 
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
                type: 'string',
                default: 0,
            },
            title: {
                type: 'string',
                default: '',
            },
        },
        edit,
        save,
    }
];

export default settings;