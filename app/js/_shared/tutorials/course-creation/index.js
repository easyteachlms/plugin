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
                            In less than 5 minutes we&apos;ll have you creating
                            your first course in the EasyTeach LMS system. It's
                            easy, fun, and designed to let your creativity run
                            wild.
                        </p>
                    </Page>

                    <Page
                        title="Lessons"
                        videoSrc={intro}
                        activePage={currentPage}
                        pageNumber={2}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            The first step in creating a course is creating a
                            lesson.
                        </p>
                        <p>
                            All courses require at least one{' '}
                            <strong>Lesson</strong> block and at least one{' '}
                            <strong>Lesson Content</strong> block inside. Thats
                            it, thats the only requirement. You can experiment
                            in a variety of ways of structuring your course.
                        </p>
                        <p>
                            For example: you could create a lesson for every
                            week scheduled in a course:{' '}
                            <i>Week 1, Week 2, etc...</i>. Inside each Lesson
                            you could have one <strong>Lesson Content</strong>{' '}
                            block with all the content for that week or you
                            could break it out into one content block for each
                            video/element of content.
                        </p>
                        <p>
                            To get started, click the Add Lesson button and
                            create a new Lesson <i>OR</i> search for an existing
                            one.
                        </p>
                        <p>
                            Once you've created a new Lesson you then can move
                            on to inserting content and quizzes.
                        </p>
                    </Page>

                    <Page
                        title="Adding Content (Part 1)"
                        videoSrc={addingContent1}
                        activePage={currentPage}
                        pageNumber={3}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            EasyTeach LMS uses the power of the new WordPress
                            Block Editor, sometimes refered to as{' '}
                            <i>&quot;Gutenberg&quot;</i> to allow you to easily
                            and visually build rich content courses. Every piece
                            of content in a Gutenberg powered post is a{' '}
                            <i>Block</i>.
                        </p>
                        <p>
                            As described in the prior page course content lives
                            inside <strong>Lesson Content</strong> blocks.
                        </p>
                        <p>
                            To get started, lets add a video. You can use video
                            service that WordPress supports natively - or
                            download support for additional video services via
                            3rd party plugins. You can even host your own videos
                            if you&apos;re using a serivce like Jetpack or any
                            other service that offers native WordPress video
                            hosting.
                        </p>
                        <p>
                            For this demo let&apos;s use a Vimeo hosted video.
                            You can click the plus icon in the editor and click
                            Vimeo <i>OR</i> you can paste a Vimeo video link
                            into the editor and it will insert the video
                            automatically for you.
                        </p>
                    </Page>

                    <Page
                        title="Adding Content (Part 2)"
                        videoSrc={addingContent2}
                        activePage={currentPage}
                        pageNumber={4}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            Of course video&apos;s are not the only content you
                            can add. We support all native WordPress
                            functionality, so that means you can embed
                            Slideshare presentations, audio podcasts, Google
                            maps, even music from Spotify. Just search for the
                            service in the block editor or paste in links to
                            popular 3rd party sites and they will be embedded
                            automatically.
                        </p>
                        <p>
                            Thats how easy it is to build rich media filled
                            courses. In our next step we&apos;ll go over how
                            easy it is to build quizzes.
                        </p>
                    </Page>

                    <Page
                        title="Gutenberg Basics"
                        videoSrc={addingContent2}
                        activePage={currentPage}
                        pageNumber={5}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            If you&apos;re new to the WordPress Block Editor
                            &quot;Gutenberg&quot; here are some helpful hints to
                            remember when building your course.
                        </p>
                        <p>
                            The + icon will always open a dropdown with your
                            recently used blocks. Click{' '}
                            <strong>&quot;Browse All&quot;</strong> to access
                            all available blocks, including &quot;File&quot; or
                            &quot;Download`quot;.
                        </p>
                        <p>
                            To save even more time you use the keyboard shortcut{' '}
                            <pre>/</pre> to bring up a list of blocks what will
                            filter as you type and search (see example to the
                            left).
                        </p>
                    </Page>

                    <Page
                        title="Creating Quizzes"
                        videoSrc={creatingQuiz}
                        activePage={currentPage}
                        pageNumber={6}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            Quizzes can be added to any <strong>Lesson</strong>{' '}
                            block. You&apos;ll have an option of multiple choice
                            or singular choice based answers as well as
                            assigning point values to questions and answers.
                        </p>
                    </Page>

                    <Page
                        title="Saving Content"
                        videoSrc={savingContent}
                        activePage={currentPage}
                        pageNumber={7}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            Lessons can be saved outside the scope of a course.
                            This allows for easy centralization and re-use of
                            content.
                        </p>
                        <p>
                            In the <strong>Lesson</strong> block clicking the
                            button &quot;Save As New&quot; will allow you to
                            save a version of your content for use in other
                            courses.
                        </p>
                        <p>
                            If there is ever any changes to the{' '}
                            <strong>Lesson</strong> you&apos;ve saved
                            you&apos;ll get a notification and an option to
                            update your content.
                        </p>
                    </Page>

                    <Page
                        title="On Your Own"
                        imgSrc={illustration}
                        activePage={currentPage}
                        pageNumber={8}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                        closeModal={toggleOpen}
                    >
                        <p>
                            You&apos;re now ready to start creating your own
                            courses in EasyTeach LMS!
                        </p>
                        {true === enableExample && (
                            <Fragment>
                                <p>
                                    Click close tutorial to end the tutorial and
                                    start creating or click Load Example to load
                                    an example course.
                                </p>
                                <p style={{ textAlign: 'center' }}>
                                    <Button isSecondary>
                                        Load Example Content
                                    </Button>
                                </p>
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
