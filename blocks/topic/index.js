import { registerBlockType } from '@wordpress/blocks';
import settings from './settings';
import './topic.scss';

registerBlockType(...settings);
