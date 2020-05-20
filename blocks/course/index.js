import { registerBlockType, registerBlockCollection } from '@wordpress/blocks';
import settings from './settings';
import './course.scss';

registerBlockCollection( 'easyteachlms', { title: 'EasyTeach LMS' } );
registerBlockType(...settings);