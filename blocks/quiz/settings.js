import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/quiz',
    {
        title: __('Quiz'),
        description: 'Block Desc.',
        category: 'education',
        keywords: [__('Quiz')],
        supports: {
            html: false,
            align: false,
        },
        attributes: {
            title: {
                type: 'string',
                default: 'Quiz Title Here',
            },
            uuid: {
                type: 'string',
                default: 0,
            },
            pointsRequiredToPass: {
                type: 'integer',
                default: 80,
            },
            requirePassing: {
                type: 'boolean',
                default: false,
            },
        },
        edit,
        save,
        parent: ['easyteachlms/lesson'],
    },
];

export default settings;
