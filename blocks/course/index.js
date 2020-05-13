import { registerBlockType, registerBlockCollection } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n'; 
import settings from './settings';
import './course.scss';

registerBlockCollection( 'easyteachlms', { title: 'EasyTeach LMS' } );
registerBlockType(...settings);