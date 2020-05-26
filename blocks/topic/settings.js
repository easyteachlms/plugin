
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/topic',
    {
        title: __('Topic'), 
        description: 'Block Desc.',
        category: 'education',
        keywords: [
            __( 'Topic' ),
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
                type: 'integer',
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