import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

const settings = [
    'easyteachlms/certificate',
    {
        title: __('Certificate'),
        description: 'Completion Certificate',
        category: 'education',
        keywords: [__('Certificate')],
        supports: {
            html: false,
            align: false,
            multiple: false,
        },
        attributes: {
            backgroundColor: {
                type: 'string',
                default: '',
            },
            borderColor: {
                type: 'string',
                default: '',
            },
            requiredScore: {
                type: 'integer',
                default: 80,
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
