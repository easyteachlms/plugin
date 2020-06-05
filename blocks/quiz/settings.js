
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/quiz',
    {
        title: __('Quiz'), 
        description: 'Block Desc.',
        category: 'education',
        keywords: [
            __( 'Quiz' ),
        ],
        supports: {
            html: false, 
            align: true
        },
        attributes: {
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