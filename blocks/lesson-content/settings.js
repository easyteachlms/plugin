import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/lesson-content',
    {
        title: __('Lesson Content'),
        description: 'Block Desc.',
        category: 'education',
        keywords: [__('Lesson')],
        supports: {
            html: false,
            align: false,
        },
        attributes: {
            title: {
                type: 'string',
                default: '',
            },
            uuid: {
                type: 'string',
                default: 0, // At block init a UUID will be generated based on timestamp
            },
        },
        edit,
        save,
    },
];

export default settings;
