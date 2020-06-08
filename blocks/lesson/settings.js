
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/lesson',
    {
        title: __('Lesson'), 
        description: 'Block Desc.',
        category: 'education',
        keywords: [
            __( 'Lesson' ),
        ],
        supports: {
            html: false, 
            align: false,
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