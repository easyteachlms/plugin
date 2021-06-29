
import { Fragment, render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import AddCoursesField from './courses-field';

domReady(()=>{
    if ( document.getElementById('js-easyteach-courses-field') ) {
        const input = document.getElementById('js-easyteach-courses-field').querySelector('input');
        render(<AddCoursesField inputField={input}/>, document.getElementById('js-easyteach-courses-field-attach'));
    }
});