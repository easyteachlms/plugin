import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/question',
    {
        title: __('Question'),
        description: 'Block Desc.',
        category: 'education',
        icon: 'editor-help',
        keywords: [__('Quiz')],
        supports: {
            html: false,
            align: false,
        },
        parent: ['easyteachlms/quiz'],
        attributes: {
            question: {
                type: 'string',
                default: '',
            },
            type: {
                type: 'string',
                default: 'text',
            },
            answersType: {
                type: 'string',
                default: 'single',
            },
            explanation: {
                type: 'string',
                default: '',
            },
            points: {
                type: 'string',
                default: '10',
            },
            picture: {
                type: 'string',
                defualt: '',
            },
        },
        edit,
        save,
    },
];

export default settings;
