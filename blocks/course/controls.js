import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { Toolbar, ToolbarButton, Icon } from '@wordpress/components';
import { help } from '@wordpress/icons';

import { CourseCreationTutorial } from '@easyteachlms/shared';

const Controls = () => {
    const [open, toggleOpen] = useState(false);
    return (
        <Fragment>
            <Toolbar label="Options" style={{ width: '100%' }}>
                <div style={{ flexGrow: '1' }}>
                    <button
                        type="button"
                        data-experimental-toolbar-item="true"
                        className="components-button components-toolbar__control has-text has-icon"
                        aria-label="Need Help?"
                    >
                        <Icon icon="welcome-learn-more" />
                        EasyTeach LMS Course Builder
                    </button>
                </div>
                {/* <ToolbarButton icon={ 'groups' } label="Manage Students">Manage Students</ToolbarButton> */}
                <ToolbarButton
                    icon={help}
                    label="Need Help?"
                    onClick={() => toggleOpen(true)}
                >
                    Need Help?
                </ToolbarButton>
            </Toolbar>
            <CourseCreationTutorial open={open} toggleOpen={toggleOpen} />
        </Fragment>
    );
};

export default Controls;
