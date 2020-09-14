import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';

import './style.scss';

import illustration from './art/basic.png';

const intro = '//beta.easyteachlms.com/wp-content/uploads/2020/08/intro.mp4';
const addingContent1 =
    '//beta.easyteachlms.com/wp-content/uploads/2020/08/intro.mp4';
const addingContent2 =
    '//beta.easyteachlms.com/wp-content/uploads/2020/08/intro.mp4';
const creatingQuiz =
    '//beta.easyteachlms.com/wp-content/uploads/2020/08/intro.mp4';
const savingContent =
    '//beta.easyteachlms.com/wp-content/uploads/2020/08/intro.mp4';

const Page = ({
    title,
    imgSrc = false,
    videoSrc = false,
    children,
    activePage,
    pageNumber,
    goToPage,
    setTitle,
    closeModal,
}) => {
    if (pageNumber !== activePage) {
        return <Fragment />;
    }
    setTitle(title);
    return (
        <div
            style={{ maxWidth: '900px', width: '100%' }}
            className="easyteach-tutorial-page"
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        width: '60%',
                        paddingRight: '1em',
                        borderRight: '1px solid #eaeaea',
                    }}
                >
                    {false !== videoSrc && false === imgSrc && (
                        <video controls autoPlay>
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    )}
                    {false === videoSrc && false !== imgSrc && (
                        <img src={imgSrc} style={{ width: '100%' }} />
                    )}
                </div>
                <div style={{ width: '40%', paddingLeft: '1em' }}>
                    {children}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    paddingTop: '1em',
                    marginTop: '1em',
                    borderTop: '1px solid #eaeaea',
                }}
            >
                <div
                    style={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                    }}
                >
                    {1 !== pageNumber && (
                        <Button
                            isSecondary
                            onClick={() => goToPage(pageNumber - 1)}
                        >
                            Previous
                        </Button>
                    )}
                </div>
                <div
                    style={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    {8 !== pageNumber && (
                        <Button
                            isPrimary
                            onClick={() => goToPage(pageNumber + 1)}
                        >
                            Next
                        </Button>
                    )}
                    {8 === pageNumber && (
                        <Button
                            isPrimary
                            onClick={() => {
                                if ('function' === typeof closeModal) {
                                    closeModal(false);
                                    goToPage(1); // Reset page
                                }
                            }}
                        >
                            Close Tutorial
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Tutorial = ({ open = false, toggleOpen, enableExample = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState('Welcome to EasyTeach LMS');
    return (
        <Fragment>
            {true === open && (
                <Modal
                    title={title}
                    onRequestClose={() => {
                        if ('function' === typeof toggleOpen) {
                            toggleOpen(false);
                        }
                        setCurrentPage(1); // Reset page
                    }}
                >
                    <Page
                        title="Welcome to EasyTeach LMS"
                        imgSrc={illustration}
                        activePage={currentPage}
                        pageNumber={1}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            In as little as 5 minutes, our EasyTeach LMS
                            tutorial will help you set up your first course,
                            upload content, and create the learning environment
                            best suited to your learners (clients, students,
                            employees). Remember, EasyTeach is designed to let
                            you customize just about anything for an E-Learning
                            environment -- SO LET’S GET STARTED!
                        </p>
                    </Page>

                    <Page
                        title="Introducing the Block Editor (Gutenberg)"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={2}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <ul>
                            <li>
                                The EasyTeach platform takes advantage of the
                                popular WordPress Block Editor, “Gutenberg,”
                                rapidly becoming the editor of choice for
                                amateurs and World-Class Developers alike. With
                                Gutenberg’s simple interface, dynamic “drag &
                                drop” features, and duplicate-post
                                functionality, your dream experience is just a
                                few clicks away, no matter what you teach.
                            </li>
                            <li>
                                Gutenberg is built on BLOCKS. Blocks allow you
                                to add any kind of multi-media content – the sky
                                is the limit. The key to mastering Gutenberg
                                Blocks & EasyTeach LMS is in the magic + button
                                (Show image). Whether you want to add a new
                                lesson, video, quiz, or file, the + (Show image)
                                button is all you need.
                            </li>
                            <li>
                                If you are currently using another website or
                                page-builder like WP Bakery or Elementor, not to
                                worry! CLICK HERE to set up EasyTeach to
                                seamlessly integrate with your existing website!
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Create an E-Course"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={3}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            All EasyTeach COURSES are comprised of at least one
                            LESSON BLOCK which contains at least one CONTENT
                            BLOCK – But you can structure a course in a variety
                            of ways, with as many LESSON and CONTENT Blocks as
                            you wish.
                        </p>
                        <ul>
                            <li>
                                Step 1: NAME YOUR COURSE or PRODUCT (eg:
                                Psychology 101 or Yoga for Beginners)
                            </li>
                            <li>
                                Step 2 : Create a LESSON within the COURSE. All
                                courses require at least one LESSON block and at
                                least one CONTENT block inside the LESSON block.
                                You can structure any course with this simple
                                building-block foundation. From there, you can
                                add multiple LESSONS and CONTENT blocks within
                                each LESSON, featuring videos, PDFs, links, and
                                so on. PRETTY EASY, HUH?
                                <ul>
                                    <li>
                                        For Example: You could create a daily,
                                        weekly, or time-structured LESSON or
                                        create a series of self-paced lessons
                                        within each course.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Step 3: Click the plus button (show image) and
                                then select LESSON to create a new Lesson, OR
                                search for an existing LESSON that you
                                previously created (Learn more about
                                DUPLICATE-CONTENT & DUPLICATE-COURSE FEATURES
                                HERE) – SETH – link to tutorial page on Saving
                                as New Lesson. For Duplicate Content – just
                                install Duplicate Post and then instructions for
                                how to duplicate?).
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Course Content (videos, text, PDFs, PPTs, Links) lives inside CONTENT blocks, which live inside LESSON blocks"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={4}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <ul>
                            <li>
                                Let’s start with adding a video to your course.
                                First, click your trusty + button and select
                                CONTENT from the pop-up box to add a CONTENT
                                block. You can use any video service that
                                WordPress supports (i.e Vimeo or YouTube), or
                                download support for additional video services
                                via 3rd-party tools and plug-ins. You can ALSO
                                host your own videos if you're using a service
                                like Jetpack that offers WordPress video
                                hosting.
                            </li>
                            <li>
                                For this demo let's assume you use a
                                Vimeo-hosted video.
                            </li>
                            <li>
                                Click the + button (show image) and select your
                                item from the pop-up box OR click “Browse All”
                                to see all of your options. You can select
                                Vimeo, OR you can paste a Vimeo-video link into
                                the editor and it will automatically insert the
                                video for you.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Don’t stop at videos!  You can add course content of all kinds!"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={5}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <ul>
                            <li>
                                We support all native (that is, built-in)
                                WordPress functionality, so that means you can
                                embed Slideshare presentations, audio podcasts,
                                Google maps, even “licensed” music from your
                                favorite multi-media source such as Spotify or
                                YouTube. Again, just click your trusty + plus
                                button (show image), select your item from the
                                pop-up box OR click “Browse All” to see all of
                                your options. Want to make life even simpler?
                                Just paste links to popular 3rd party sites and
                                they will be embedded automatically.
                            </li>
                            <li>
                                That’s how easy it is to build media-filled,
                                content-rich courses. In our next step, we'll go
                                over how easy it is to build quizzes.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Quizzes can be added to any Lesson block."
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={6}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <ul>
                            <li>
                                You can add a quiz to every lesson or a final
                                quiz at the end of the course. Quizzes can be
                                configured any way you like including:
                                <ul>
                                    <li>
                                        Create multiple-choice questions such
                                        as: A-B-C-D
                                    </li>
                                    <li>
                                        Provide word-based answers (blue, green,
                                        purple, yellow)
                                    </li>
                                    <li>
                                        Provide a Text Box for written responses
                                    </li>
                                    <li>
                                        Assign point values to each response
                                        (Question 1 = 5 pts, Question 2 = 10
                                        pts, Question 3 = 20 pts), etc.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                To build a quiz, navigate to the Lesson where
                                you want to insert a quiz, click the + button
                                (show image) and select QUIZ from the pop-up
                                box. Next, add a title for your quiz and click
                                “Add quiz.” Click the + again to add your first
                                question where indicated. Type your question and
                                then navigate to the panel on the right to
                                define the kind of questions in the QUESTIONS
                                SETTINGS section. You can add a questions
                                explanation, define text for correct and
                                incorrect answers, switch from text to photo
                                questions, and define whether your question has
                                a single answer, multiple answers, or even
                                written text or essay answers. Lastly, you can
                                define point value for each question.{' '}
                            </li>
                            <li>
                                Now it’s time to define the answer. Adding
                                answers is as easy as clicking the + button.
                                Click the button and add your answer text (i.e.
                                True/False). You will need to add an answer
                                field for every choice. For example, for a
                                True/False quiz the first answer box would be
                                “True,” the second, “False.” Click on the Smiley
                                Face (show image) to indicate the correct
                                answer. When the family face is White on a Black
                                Background, your answer is marked as the correct
                                answer
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Duplicate Lessons and Content"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={7}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            Another exciting feature to your EasyTeach LMS is
                            the option to save and duplicate CONTENT BLOCKS &
                            LESSONS for re-use within a COURSE, or from one
                            COURSE to another COURSE. Your Easy Teach CONTENT
                            LIBRARY is actually a powerful, customizable CMS
                            (Content Management System) enabling you to re-use
                            content with a few simple clicks.
                        </p>
                        <ul>
                            <li>
                                In the LESSON block, click the button "SAVE AS
                                NEW" to save a version of your content for use
                                in other courses.
                            </li>
                            <li>
                                If you ever need to add or make changes to the
                                LESSON you've saved, open the COURSE and you'll
                                be prompted with the option to update LESSONS
                                that have updated content.
                            </li>
                            <li>
                                Want to use a previous lesson as a template?
                                THAT’S EASY, TOO! Click Here to Learn More about
                                Duplicating Content.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="More Helpful Tips"
                        imgSrc={illustration}
                        activePage={currentPage}
                        pageNumber={8}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                        closeModal={toggleOpen}
                    >
                        <p>Mak the Most of Gutenberg Editing Tools</p>
                        <ul>
                            <li>
                                The + icon (show image) will always open a
                                pop-up with your recently-used blocks. Click
                                "Browse All" to access all available blocks,
                                including "File" or "Download”;.
                            </li>
                            <li>
                                To save even more time, use the keyboard
                                shortcut “ / ” to bring up a list of blocks that
                                will filter as you type and search (see example
                                to the left).
                            </li>
                        </ul>
                        {true === enableExample && (
                            <Fragment>
                                <p>Want to see EasyTeach in Action?</p>
                                <p>
                                    We created 2 simple courses that you can
                                    import with the touch of a button.
                                </p>
                                <ul>
                                    <li>
                                        Option 1: Beginner Course with 1 Lesson
                                        Block (Video) + 1 Content Block
                                        (Downloadable PDF Exercise).
                                        <Button isSecondary>Import Now</Button>
                                    </li>
                                    <li>
                                        Option 2: Advanced Course with Multiple
                                        Lesson Blocks + Multiple Content Blocks
                                        + Multiple Quizzes.
                                        <Button isSecondary>Import Now</Button>
                                    </li>
                                </ul>
                            </Fragment>
                        )}
                    </Page>
                </Modal>
            )}
        </Fragment>
    );
};

const TutorialButton = ({ disable = false, enableExample = false }) => {
    const [open, toggleOpen] = useState(false);
    return (
        <Fragment>
            <Button
                isPrimary
                onClick={() => {
                    toggleOpen(true);
                }}
            >
                Begin Tutorial
            </Button>
            <Tutorial
                open={open}
                toggleOpen={toggleOpen}
                enableExample={enableExample}
            />
        </Fragment>
    );
};

export { Tutorial, TutorialButton };
export default TutorialButton;
