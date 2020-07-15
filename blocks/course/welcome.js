import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { Segment } from 'semantic-ui-react';

import {
    CourseCreationTutorial,
    WelcomeGraphic as illustration,
} from '@easyteachlms/shared';

const Welcome = ({ welcomeDisabled, children, setAttributes }) => {
    const disable = (condition) => {
        if (true === condition) {
            setAttributes({ welcomeDisabled: true });
        } else {
            setAttributes({ welcomeDisabled: false });
        }
    };

    const Prompt = () => {
        const Art = () => {
            return (
                <div style={{ textAlign: 'center' }}>
                    <img src={illustration} />
                </div>
            );
        };

        return (
            <Fragment>
                <Segment>
                    <div style={{ display: 'flex', flexGrow: 1 }}>
                        <div style={{ width: '50%' }}>
                            <Art />
                        </div>
                        <div style={{ width: '50%' }}>
                            <h1>Hi! First time here?</h1>
                            <p>
                                <strong>
                                    Get started building your EasyTeach LMS
                                    powered course.
                                </strong>{' '}
                                Over the next 5 minutes we will walk you through
                                creating your first course, lesson plan, and
                                course content. At any time you can find this
                                tutorial, and others, in the EasyTeach LMS
                                settings in the dashboard.
                            </p>

                            <CourseCreationTutorial disable={disable} />

                            <Button
                                isSecondary
                                onClick={() => {
                                    setAttributes({ welcomeDisabled: true });
                                }}
                            >
                                {__("Don't show tutorial again")}
                            </Button>
                        </div>
                    </div>
                </Segment>
            </Fragment>
        );
    };

    return (
        <Fragment>
            {true !== welcomeDisabled && (
                <Fragment>
                    <Prompt />
                    {children}
                </Fragment>
            )}
            {true === welcomeDisabled && children}
        </Fragment>
    );
};

export default Welcome;
