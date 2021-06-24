/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import {
    TextareaControl,
    Toolbar,
    ToolbarButton,
    Icon,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { CourseCreationTutorial } from '@easyteachlms/components';

const Controls = ({ clientId, attributes, setAttributes }) => {
    const { description } = attributes;
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
                <ToolbarButton
                    icon="sos"
                    label="Need Help?"
                    onClick={() => toggleOpen(true)}
                >
                    Need Help?
                </ToolbarButton>
            </Toolbar>
            <CourseCreationTutorial
                courseClientId={clientId}
                open={open}
                toggleOpen={toggleOpen}
                enableExample
            />
            <div
                style={{
                    marginTop: '1em',
                }}
            >
                <TextareaControl
                    label="Course Description"
                    placeholder="Enter a short description for this course here..."
                    value={description}
                    onChange={(value) => setAttributes({ description: value })}
                />
            </div>
        </Fragment>
    );
};

export default Controls;
