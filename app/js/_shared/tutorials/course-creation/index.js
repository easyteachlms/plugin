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
                            In just 10 minutes, our EasyTeach LMS tutorial will
                            help you to set up your first course, upload
                            content, and create the teaching and learning
                            environment best suited to for you and your users.
                            Remember, EasyTeach enables you to customize any
                            part of your E-Learning environment -- SO LET’S GET
                            STARTED!
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
                                Your EasyTeach LMS features the WordPress Block
                                Editor, “Gutenberg,” popular with amateurs and
                                World-Class Developers alike. This simple but
                                dynamic tool puts “drag & drop” features,
                                customization options, and duplicate-post
                                functionality just a few clicks away.
                            </li>
                            <li>
                                EasyTeach is built on the Gutenberg BLOCK
                                system, featuring customized buttons that
                                highlight your course BLOCKS (such as lessons,
                                quizzes, content, and certificates). Inside your
                                blocks, the EASY + button (Show image) is the
                                key to adding multi-media content of all kinds –
                                anything from YouTube videos to links, text,
                                images, downloads, and much more.
                            </li>
                            <li>
                                PRO TIP: As you build your courses, you’ll also
                                find additional options for customizing your
                                courses, lessons, and content on the right-hand
                                side of the screen.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="How to Create the First Lesson in Your E-COurse"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={3}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <h3>
                            Step 1: NAME YOUR COURSE or PRODUCT and SELECT YOUR
                            COURSE OPTIONS (eg: Psychology 101 or Yoga for
                            Beginners).
                        </h3>
                        <p>
                            Type your COURSE TITLE in the field labeled “Add
                            title.”
                        </p>
                        <p>
                            On the right-hand side of the screen, you’ll have
                            the option to add a “FEATURED IMAGE” for your
                            course, create an EXCERPT (a short course
                            description), select “CATEGORIES” for your course
                            (eg: Finance, Fitness, Fashion). You can also set a
                            future-publishing date for the course.{' '}
                        </p>
                        <h3>Step 2: Create a LESSON within the COURSE</h3>
                        <p>
                            All EasyTeach COURSES are comprised of at least one
                            LESSON BLOCK, which contains at least one CONTENT
                            BLOCK. – But there’s no limit to the number of
                            LESSON & CONTENT BLOCKS you can include in an
                            E-COURSE. You can structure any course with this
                            simple building-block foundation. Each CONTENT BLOCK
                            can feature anything from videos, PDFs, and PPTs to
                            web & social media links. Yes, it’s really that
                            EASY!
                        </p>
                        <p>
                            To create a LESSON, click the button entitled “ADD
                            LESSON OR CERTIFICATE” (show image) and then select
                            “LESSON” to create a new Lesson. You’ll then have
                            the option to “START A NEW LESSON” or “SEARCH FOR AN
                            EXISTING LESSON” that you previously created in
                            another course (Learn more about “DUPLICATE-CONTENT”
                            & “DUPLICATE-COURSE” FEATURES HERE).
                        </p>
                        <p>
                            To START A NEW LESSON, enter your LESSON title in
                            the field labeled “Title,” and click CREATE LESSON.
                        </p>
                        <p>
                            Once you have created your lesson or loaded an
                            existing lesson, you’ll find LESSON options on the
                            right-hand of your screen. You can create a series
                            of self-paced lessons within each course OR schedule
                            content for daily, weekly, or time-structured
                            LESSONS. To schedule content, simply select the date
                            and time you want your content available from the
                            “SCHEDULE FOR FUTURE RELEASE” section. If you’re
                            offering a self-paced course (anytime, anywhere),
                            there’s no need for scheduling
                        </p>
                        <p>
                            NOTE: Once you've created a new LESSON, you can move
                            on to inserting content and quizzes. That’s next on
                            this tutorial…
                        </p>
                    </Page>

                    <Page
                        title="HOW-TO ADD COURSE CONTENT (videos, text, PDFs, PPTs, Links)"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={4}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            CONTENT is added inside CONTENT blocks, which live
                            inside LESSON blocks.
                        </p>
                        <ul>
                            <li>
                                <p>
                                    STEP 1: Let’s start with adding a video to
                                    the LESSON you created in the previous step.
                                    First, click your EASY button in the box
                                    labeled “ADD CONTENT or QUIZ” and select
                                    CONTENT from the pop-up box to add a CONTENT
                                    block. Give your CONTENT a TITLE and click
                                    “ADD CONTENT”.
                                </p>
                                <p>
                                    For this demo, let's assume you’ll use a
                                    Vimeo-hosted video.
                                </p>
                                <p>
                                    NOTE: You can use any video service that
                                    WordPress supports (eg: Vimeo or YouTube);
                                    or download support for additional video
                                    services via 3rd-party tools and plug-ins.
                                    You can ALSO host your own videos if you're
                                    using a service like Jetpack that offers
                                    WordPress video hosting.
                                </p>
                            </li>
                            <li>
                                STEP 2: Click the EASY + button (show image) and
                                select your item from the pop-up box -- OR --
                                click “Browse All” to see all options. Select
                                Vimeo, paste your URL in the box labeled “Enter
                                URL to embed here,” then click the Embed button
                                and just like that, you’ve added a video to your
                                course.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Add any kind of course content!"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={5}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <ul>
                            <li>
                                EasyTeach supports all native WordPress
                                functionality (eg: anything already built-for
                                WordPress. That means you can embed Slideshare
                                presentations, audio podcasts, Google maps, even
                                “licensed” music from your favorite multi-media
                                source such as Spotify or YouTube. Again, just
                                click your EASY “ADD CONTENT of QUIZ” button
                                (show image), select your item from the pop-up
                                box, OR click “Browse All” to see all options.
                            </li>
                            <li>
                                That’s how easy it is to build media-filled,
                                content-rich E-courses. In our next step, we'll
                                go over how easy it is to build customizable
                                quizzes.
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
                                        pts, Question 3 = 20 pts), etc, and
                                        define an overall passing score for the
                                        quiz.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                To build a quiz, navigate to the Lesson where
                                you want to insert a quiz, click the “ADD
                                CONTENT OR QUIZ” button (show image) and select
                                QUIZ from the pop-up box.
                            </li>
                            <li>
                                Next, add a title for your quiz (eg: Budgeting
                                101) and click “ADD QUIZ.”
                            </li>
                            <li>
                                <p>
                                    To add your first question, click the “ADD A
                                    QUESTION” button. Type your question in the
                                    field labeled “QUESTION TEXT HERE,” then
                                    navigate to the panel on the right to define
                                    QUESTION SETTINGS section. You can add an
                                    explanation for your questions, define the
                                    display text for correct and incorrect
                                    answers, switch from text to photo
                                    questions, and define whether your question
                                    has a single correct answer (i.e. True or
                                    False or multiple choice A-D) or
                                    multiple-correct answers (A and C). Lastly,
                                    you can define point value for each
                                    question.
                                </p>
                                <ul>
                                    <li>
                                        <p>
                                            For example, for the TRUE/FALSE
                                            question (2+2=5), you would choose
                                        </p>
                                        <ul>
                                            <li>Question Type: Text</li>
                                            <li>Answers Type: Single</li>
                                            <li>
                                                Points: Any value you would like
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <p>
                                    Now it’s time to define the answer. Click on
                                    “ADD AN ANSWER” to define your answer
                                    options. Adding answers is as easy as
                                    clicking the “ADD ANSWER” button. Click the
                                    button and add your answer text (i.e.
                                    True/False or A/B/C/D). You will need to add
                                    an answer field for every choice. Click on
                                    the Smiley Face (show image) to indicate the
                                    correct answer. When the SMILEY FACE is
                                    White on a Black Background, your answer is
                                    marked as the correct answer (SHOW IMAGE).
                                    When you choose MULTIPLE as the QUESTION
                                    TYPE, you can indicate multiple-correct
                                    answers using the SMILEY FACE
                                </p>
                                <ul>
                                    <li>
                                        Using our same example, TRUE/FALSE
                                        question (2+2=5), you would add two
                                        answers: TRUE and FALSE. To do this,
                                        click on “ADD AN ANSWER” and enter TRUE
                                        in the field labeled “ANSWER TEXT HERE.”
                                        Repeat the process and enter FALSE in
                                        the field labeled “ANSWER TEXT HERE.”
                                        Click on the Smiley Face (SHOW IMAGE) to
                                        indicate which answer is correct. In our
                                        example, we would click the SMILEY FACE
                                        on the answer FALSE.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                You can use any combination of question types
                                and there are no limitations on the number of
                                answers!
                            </li>
                            <li>
                                Need teacher-graded quizzes? Essay responses?
                                Check out our BuddyPress integration (CLICK HERE
                                TO LEARN MORE) with robust features to manage
                                your students and their progress.
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
                                First you’ll need to save your lesson. You can
                                do this when you first create your lesson by
                                clicking on the “SAVE AS NEW LESSON” button
                                below the title field from the right-hand
                                toolbar OR you can return to any LESSON you have
                                created and click on the “SAVE AS NEW LESSON”
                                button to add it your content library.
                            </li>
                            <li>
                                You can now easily add your saved LESSON to any
                                course. From your Course, click on the ADD A
                                LESSON OR CERTIFICATE button and select LESSON.
                                Next search for your existing lesson in the
                                field entitled SEARCH FOR AN EXISTING LESSON.
                                Select the desired lesson from the drop down and
                                SHAZAM! Your lesson has been added to your
                                course. This is one of our coolest EasyTeach
                                features designed to save you time!
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Bonus Tips"
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
                                The EASY + icon (show image) will always open a
                                pop-up with your recently-used blocks. Click
                                "Browse All" to access all available blocks.
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
                        <h3>Need more help?</h3>
                        <p>
                            You can return to this tutorial and access our help
                            resources at any time by navigating to the EasyTeach
                            LMS Settings & Help page found HERE OR navigate to
                            the WordPress Dashboard, click on EasyTeach LMS from
                            the black menu on the left-hand side, and then
                            select Settings & Help.
                        </p>
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
