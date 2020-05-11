import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n'; 
import settings from './settings';

registerBlockType(...settings);