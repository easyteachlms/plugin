import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

const settings = [
    'sethrubenstein/ghost-block',
    {
        title: __('Ghost Block'),
        description: 'Ghost Block.',
        category: 'education',
        supports: {
            html: true,
            inserter: false,
        },
        edit: () => {
            return <InnerBlocks />;
        },
        save: ({ attributes }) => {
            return <InnerBlocks.Content />;
        },
    },
];

registerBlockType(...settings);
