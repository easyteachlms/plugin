import { registerBlockType } from '@wordpress/blocks';
import settings from './settings';
import './lesson.scss';

registerBlockType(...settings);