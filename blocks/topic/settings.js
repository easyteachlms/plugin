import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/topic',
    {
        title: __('Topic'),
        description: 'Block Desc.',
        category: 'education',
        keywords: [__('Topic')],
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
