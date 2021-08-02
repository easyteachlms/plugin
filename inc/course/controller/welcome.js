/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { Card, CardBody, CardDivider, CardFooter, Button, CardHeader, Flex, FlexBlock, FlexItem } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import {
    CourseCreationButton,
    WelcomeGraphic as illustration,
} from '@easyteachlms/components';

const Welcome = ({ clientId, welcomeDisabled, children, setAttributes }) => {
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
                <Card>
                    <CardHeader>
                    Hi! First time here?
                    </CardHeader>
                    <CardBody>
                        <Flex>
                            <FlexBlock>
                                <Art />
                            </FlexBlock>
                            <FlexBlock>
                                <p>
                                    <strong>
                                        Get started building your EasyTeach LMS
                                        powered course.
                                    </strong>{' '}
                                    Over the next 10 minutes we will walk you
                                    through creating your first course, lesson plan,
                                    and course content. At any time you can find
                                    this tutorial, and others, in the EasyTeach LMS
                                    settings in the dashboard or the{' '}
                                    <strong>Need Help</strong>
                                    button in the course toolbar.
                                </p>

                                <CourseCreationButton
                                    courseClientId={clientId}
                                    enableExample
                                />
                            </FlexBlock>
                        </Flex>
                    </CardBody>
                </Card>
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
        </Fragment>
    );
};

export default Welcome;
