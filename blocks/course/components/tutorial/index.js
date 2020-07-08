import { withState } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { Button, Segment } from 'semantic-ui-react';
import {
    Guide as WpComGuide,
    Button as WpComButton,
} from '@wordpress/components';

import illustration from './art/basic.png';
import animatedStep1 from './art/steps/step-1-animated.gif';
import animatedStep2 from './art/steps/step-2-animated.gif';

const Tutorial = withState({
    active: false,
    disabled: false,
})(({ active, disabled, children, setState, setAttributes }) => {
    const Guide = () => {
        return (
            <WpComGuide
                onFinish={() => setState({ active: false, disabled: true })}
                pages={[
                    {
                        content: (
                            <div>
                                <h1>Welcome to EasyTeach LMS</h1>
                                <p>
                                    In less than 5 minutes we'll have you
                                    creating your first course in the EasyTeach
                                    LMS system. It's easy, fun, and designed to
                                    let your creativity run wild.
                                </p>
                            </div>
                        ),
                    },
                    {
                        image: (
                            <img
                                src={animatedStep1}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ),
                        content: (
                            <div>
                                <p>
                                    The first step in creating a course is
                                    creating a lesson. Lessons contain topics
                                    and topics contain content or quizzes.
                                </p>
                                <p>
                                    To get started, click the Add Lesson button
                                    and create a new Lesson or search for an
                                    existing one.
                                </p>
                                <p>
                                    Once you've created a new Lesson you then
                                    can move on to creating topics and adding
                                    content.
                                </p>
                            </div>
                        ),
                    },
                    {
                        image: (
                            <img
                                src={animatedStep2}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ),
                        content: (
                            <div>
                                <h3>Adding content</h3>
                                <p>
                                    EasyTeach LMS uses the power of the new
                                    WordPress Block Editor, sometimes refered to
                                    as <i>"Gutenberg"</i> to allow you to easily
                                    and visually build rich content filled
                                    courses.
                                </p>
                                <p>
                                    To get started, lets add a video. You can
                                    use video service that WordPress supports
                                    natively - or add/download support for
                                    additional video services. You can even host
                                    your own videos if you're using a serivce
                                    like Jetpack or any other service that
                                    offers native WordPress video hosting.
                                </p>
                                <p>
                                    For this demo let's use a YouTube video. You
                                    can click the plus icon in the editor and
                                    click Youtube OR you can paste a Youtube
                                    video link into the editor and it will
                                    insert it automatically for you.
                                </p>
                            </div>
                        ),
                    },
                    {
                        image: (
                            <img
                                src={animatedStep2}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ),
                        content: (
                            <div>
                                <h3>Saving content</h3>
                                <p>
                                    Lessons and Topics can be saved to the
                                    database for use in other Courses and for
                                    centralized editing of content.
                                </p>
                                <p>
                                    In either block (Lesson|Topic) you will find
                                    a small button that says Save Topic.
                                    Clicking that will save the Topic with
                                    whatever title you have entered.
                                </p>
                                <p>
                                    If there is ever any changes to the Topic
                                    you've saved you'll get a notification and
                                    an option to pull in the latest content into
                                    your course. If you've made any changes
                                    between the two your content will be
                                    overwriten with whatever is newest - or you
                                    can save the modified topic again as a new
                                    version, or you can do nothing at all - pull
                                    no content changes and continue without
                                    worrying, the choice is yours.
                                </p>
                            </div>
                        ),
                    },
                    {
                        image: (
                            <img
                                src={illustration}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ),
                        content: (
                            <div>
                                <h3>On your own</h3>
                                <p>
                                    You're now ready to start creating your own
                                    courses in EasyTeach LMS.
                                </p>
                                <p>
                                    Click finish to end the tutorial and start
                                    creating or click Load Example to load
                                    example content automatically.
                                </p>
                                <p style={{ textAlign: 'center' }}>
                                    <WpComButton isSecondary>
                                        Load Example Content
                                    </WpComButton>
                                </p>
                            </div>
                        ),
                    },
                ]}
            />
        );
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
                                    TK COPY FOR TUTORIAL CALL TO ACTION
                                </strong>{' '}
                                Lorem ipsum is a pseudo-Latin text used in web
                                design, typography, layout, and printing in
                                place of English to emphasise design elements
                                over content. It's also called placeholder (or
                                filler) text. It's a convenient tool for
                                mock-ups.
                            </p>

                            <Button
                                primary
                                onClick={() => {
                                    setState({ active: true });
                                }}
                            >
                                Give me the tour
                            </Button>

                            <Button
                                secondary
                                onClick={() => {
                                    setState({ disabled: !disabled });
                                    setAttributes({ tutorial: false });
                                }}
                            >
                                Don't show Tutorial prompt again.
                            </Button>
                        </div>
                    </div>
                </Segment>
                {true === active && <Guide />}
            </Fragment>
        );
    };

    return (
        <Fragment>
            {true !== disabled && (
                <Fragment>
                    <Prompt />
                    {children}
                </Fragment>
            )}
            {true === disabled && children}
        </Fragment>
    );
});

export default Tutorial;
