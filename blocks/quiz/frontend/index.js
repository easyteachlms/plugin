import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

domReady(()=>{
   const quizzes = document.querySelector('.quiz'); 
   // Render on quizzes with quiz id. 
   // Get the uuid.
   // Get the course structure via rest api and then pluck the quiz out by uuid.
});