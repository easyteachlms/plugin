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
    title: __('Quiz Answer'),
    description: __('Answer to a question.'),
    keywords: [__('answer')],
    edit,
    save,
};

registerBlockType(name, { ...metadata, ...settings });
