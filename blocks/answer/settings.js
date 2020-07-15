import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/answer',
    {
        title: __('Answer'),
        description: 'Block Desc.',
        category: 'education',
        icon: 'yes-alt',
        keywords: [__('Quiz')],
        supports: {
            html: false,
            align: false,
        },
        parent: ['easyteachlms/question'],
        attributes: {
            answer: {
                type: 'string',
                default: '',
            },
            isCorrect: {
                type: 'boolean',
                default: false,
            },
        },
        edit,
        save,
    },
];

export default settings;
