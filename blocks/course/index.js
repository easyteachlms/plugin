import { registerBlockType, registerBlockCollection } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n'; 
import settings from './settings';

registerBlockCollection( 'easyteachlms', { title: 'EasyTeach LMS' } );
registerBlockType(...settings);