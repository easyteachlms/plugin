import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { Guide, Button } from '@wordpress/components';

import './style.scss';
import illustration from './art/basic.png';

const animatedStep1 = 'https://beta.easyteachlms.com/wp-content/uploads/2020/07/intro.gif';
const animatedStep2 = 'https://beta.easyteachlms.com/wp-content/uploads/2020/07/adding-content-video.gif';
const animatedStep3 = 'https://beta.easyteachlms.com/wp-content/uploads/2020/07/adding-other-content.gif';
const animatedStep4 = 'https://beta.easyteachlms.com/wp-content/uploads/2020/07/adding-quiz.gif';
const animatedStep5 = 'https://beta.easyteachlms.com/wp-content/uploads/2020/07/saving-content.gif';

const Tutorial = ({ disable = false }) => {
    const [open, openTutorial] = useState(false);
    return (
        <Fragment>
            <Button
                isPrimary
                onClick={() => {
                    openTutorial(true);
                    // const modal = document.querySelector(
                    //     '.components-modal__frame.components-guide',
                    // );
                    // modal.style.maxHeight = '600px';
                    // modal.style.minWidth = '700px';
                }}
            >
                Begin Tutorial
            </Button>
            {true === open && (
                <Guide
                    onFinish={() => {
                        console.log('Tutorial Finished');
                        openTutorial(false);
                        if ('function' === typeof disable) {
                            disable(true);
                        }
                    }}
                    pages={[
                        {
                            image: (
                                <img
                                    src={illustration}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            ),
                            content: (
                                <div className="easyteachlms-tutorial-pane">
                                    <h1>Welcome to EasyTeach LMS</h1>
                                    <p>
                                        In less than 5 minutes we'll have you
                                        creating your first course in the
                                        EasyTeach LMS system. It's easy, fun,
                                        and designed to let your creativity run
                                        wild.
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
                                <div className="easyteachlms-tutorial-pane">
                                    <p>
                                        The first step in creating a course is
                                        creating a lesson. Lessons contain
                                        topics and topics contain content or
                                        quizzes.
                                    </p>
                                    <p>
                                        To get started, click the Add Lesson
                                        button and create a new Lesson <i>OR</i>{' '}
                                        search for an existing one.
                                    </p>
                                    <p>
                                        {`Once you've created a new Lesson you then
                                    can move on to creating topics and adding
                                    content.`}
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
                                <div className="easyteachlms-tutorial-pane">
                                    <h3>Adding content (Part 1)</h3>
                                    <p>
                                        EasyTeach LMS uses the power of the new
                                        WordPress Block Editor, sometimes
                                        refered to as <i>"Gutenberg"</i> to
                                        allow you to easily and visually build
                                        rich media content courses.
                                    </p>
                                    <p>
                                        To get started, lets add a video. You
                                        can use video service that WordPress
                                        supports natively - or download support
                                        for additional video services via 3rd
                                        party plugins. You can even host your
                                        own videos if you're using a serivce
                                        like Jetpack or any other service that
                                        offers native WordPress video hosting.
                                    </p>
                                    <p>
                                        For this demo let's use a YouTube video.
                                        You can click the plus icon in the
                                        editor and click YouTube <i>OR</i> you
                                        can paste a YouTube video link into the
                                        editor and it will insert the video
                                        automatically for you.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            image: (
                                <img
                                    src={animatedStep3}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            ),
                            content: (
                                <div className="easyteachlms-tutorial-pane">
                                    <h3>Adding content (Part 2)</h3>
                                    <p>
                                        {`Of course video's are not the only content
                                    you can add. We support all native WordPress
                                    functionality, so that means you can embed
                                    Slideshare presentations, audio podcasts,
                                    Google maps, even music from Spotify. Just
                                    search for the service in the block editor
                                    or paste in links to popular 3rd party sites
                                    and they will be embedded automatically.`}
                                    </p>
                                    <p>
                                        Thats how easy it is to build rich media
                                        filled courses. In our next step we'll
                                        go over how easy it is to build quizzes.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            image: (
                                <img
                                    src={animatedStep4}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            ),
                            content: (
                                <div className="easyteachlms-tutorial-pane">
                                    <h3>Building Quizzes</h3>
                                    <p>
                                        Quizzes can be added to any <i>topic</i>
                                        . You'll have an option of multiple
                                        choice or singular choice based answers
                                        as well as assigning point values to
                                        questions and answers.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            image: (
                                <img
                                    src={animatedStep5}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            ),
                            content: (
                                <div className="easyteachlms-tutorial-pane">
                                    <h3>Saving content</h3>
                                    <p>
                                        Lessons and Topics can be saved outside
                                        the scope of a course. This allows for
                                        easy centralization and re-use of
                                        content.
                                    </p>
                                    <p>
                                        {`In either block Lesson or Topic blocks
                                    clicking the button "Save Topic As New" or
                                    "Save Lesson As New" will allow you to save
                                    a version of your content for use elsewhere.`}
                                    </p>
                                    <p>
                                        {`If there is ever any changes to the Topic or
                                    Lesson you've saved you'll get a
                                    notification and an option to update your
                                    content.`}
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
                                <div className="easyteachlms-tutorial-pane">
                                    <h3>On your own</h3>
                                    <p>
                                        You're now ready to start creating your
                                        own courses in EasyTeach LMS!
                                    </p>
                                    <p>
                                        Click finish to end the tutorial and
                                        start creating or click Load Example to
                                        load an example course.
                                    </p>
                                    <p style={{ textAlign: 'center' }}>
                                        <Button isSecondary>
                                            Load Example Content
                                        </Button>
                                    </p>
                                </div>
                            ),
                        },
                    ]}
                />
            )}
        </Fragment>
    );
};

export default Tutorial;
