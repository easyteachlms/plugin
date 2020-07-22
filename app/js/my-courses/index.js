import { Fragment, render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import Grid from './grid';

const MyCourses = ({}) => {
    return(
        <Grid/>
    );
}

domReady(()=>{
    if ( document.getElementById('easyteachlms-enrolled-courses') ) {
        render( <MyCourses/>, document.getElementById('easyteachlms-enrolled-courses') );
    }
});
