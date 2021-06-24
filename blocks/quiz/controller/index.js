/**
 * WordPress Dependencies
 */

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal Dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

const settings = {
    title: __('Quiz'),
    description: __('Quiz'),
    keywords: [__('quiz')],
    edit,
    save,
};

registerBlockType(name, { ...metadata, ...settings });
