import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { Toolbar, ToolbarButton } from '@wordpress/components';
import { help } from '@wordpress/icons';

import {
    CourseCreationTutorial,
    WelcomeGraphic as illustration,
} from '@easyteachlms/shared';

const Controls = ({setAttributes}) => {
    const [open, toggleOpen] = useState(false);
    return(
        <Fragment>
            <Toolbar label="Options">
                <ToolbarButton icon={ help } label="Need Help?" onClick={()=>toggleOpen(true)}>Need Help?</ToolbarButton>
            </Toolbar>
            <CourseCreationTutorial open={open}/>
        </Fragment>
    );
}

export default Controls;