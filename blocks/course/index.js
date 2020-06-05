import { registerBlockType, registerBlockCollection } from '@wordpress/blocks';
import settings from './settings';

registerBlockCollection( 'easyteachlms', { title: 'EasyTeach LMS' } );
registerBlockType(...settings);