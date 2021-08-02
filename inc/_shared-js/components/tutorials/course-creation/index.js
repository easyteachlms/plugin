/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/alt-text */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import LoadExample from './examples';
import './style.scss';

import illustration from './art/basic.png';

const lessonsVideo =
    '//beta.easyteachlms.com/wp-content/uploads/2020/10/Lessons.mp4';
const quizVideo = '//beta.easyteachlms.com/wp-content/uploads/2020/10/Quiz.mp4';
const savingLessonsVideo =
    '//beta.easyteachlms.com/wp-content/uploads/2020/10/Saving-Lessons.mp4';
const contentVideo =
    '//beta.easyteachlms.com/wp-content/uploads/2020/10/Content.mp4';

const simpleExample = `<!-- wp:easyteachlms/lesson-content {"title":"The Brainstormer","uuid":"a326d240-eca9-11ea-b2a4-37762e86757a"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="The Brainstormer" data-uuid="a326d240-eca9-11ea-b2a4-37762e86757a"><!-- wp:embed {"url":"https://vimeo.com/453830129","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/453830129
</div></figure>
<!-- /wp:embed -->

<!-- wp:file {"id":156,"href":"https://beta.easyteachlms.com/wp-content/uploads/2020/09/Brainstormer.pdf"} -->
<div class="wp-block-file"><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/Brainstormer.pdf">Brainstormer</a><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/Brainstormer.pdf" class="wp-block-file__button" download>Download</a></div>
<!-- /wp:file --></div>
<!-- /wp:easyteachlms/lesson-content -->

<!-- wp:easyteachlms/lesson-content {"title":"Bonus Content!","uuid":"89196600-ecaa-11ea-b2a4-37762e86757a"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="Bonus Content!" data-uuid="89196600-ecaa-11ea-b2a4-37762e86757a"><!-- wp:embed {"url":"https://vimeo.com/172488085","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/172488085
</div></figure>
<!-- /wp:embed -->
</div>
<!-- /wp:easyteachlms/lesson-content -->`;

const complexExample = `<!-- wp:easyteachlms/course {"id":161,"description":"E-COURSE DESCRIPTION (30 minutes). This fun course helps you master 6 essentials to career success in 3-to-7 minute fast-paced lessons: 1) Resumes, 2) Interviews, 3) Networking, 4) Personal Branding, 5) Cover Letters, 6) Negotiations. With over 50 tools \u0026 lessons, this course is great for students, professionals, parents, teachers, employers, entrepreneurs, and recruiters alike!"} -->
<div class="wp-block-easyteachlms-course" data-course-id="161"><!-- wp:easyteachlms/lesson {"postId":220,"lastUpdated":"2020-09-13T18:09:00","title":"Part 1 • Personal Brand Essentials","uuid":"6b795d20-ecab-11ea-ac0d-a383ab93e2b6"} -->
<div class="wp-block-easyteachlms-lesson" data-title="Part 1 • Personal Brand Essentials" data-uuid="6b795d20-ecab-11ea-ac0d-a383ab93e2b6"><!-- wp:easyteachlms/lesson-content {"title":"Personal Brand Essentials","uuid":"41766670-ecac-11ea-a699-530a3e4ab3c6"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="Personal Brand Essentials" data-uuid="41766670-ecac-11ea-a699-530a3e4ab3c6"><!-- wp:embed {"url":"https://vimeo.com/190310076","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/190310076
</div></figure>
<!-- /wp:embed --></div>
<!-- /wp:easyteachlms/lesson-content --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/lesson {"title":"Part 2 • 8 Steps to Quality Career Networking","uuid":"e0b53210-ecad-11ea-a225-1d165e8d9620"} -->
<div class="wp-block-easyteachlms-lesson" data-title="Part 2 • 8 Steps to Quality Career Networking" data-uuid="e0b53210-ecad-11ea-a225-1d165e8d9620"><!-- wp:easyteachlms/lesson-content {"title":"8 Steps to Quality Career Networking","uuid":"16d78870-ecae-11ea-a699-530a3e4ab3c6"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="8 Steps to Quality Career Networking" data-uuid="16d78870-ecae-11ea-a699-530a3e4ab3c6"><!-- wp:embed {"url":"https://vimeo.com/190311741","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/190311741
</div></figure>
<!-- /wp:embed --></div>
<!-- /wp:easyteachlms/lesson-content --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/lesson {"postId":227,"lastUpdated":"2020-09-13T23:10:48","title":"Part 3 • 5 Keys to a High-Impact Cover Letter","schedule":"2020-09-17T06:00:00","uuid":"38a54000-ecae-11ea-a225-1d165e8d9620"} -->
<div class="wp-block-easyteachlms-lesson" data-title="Part 3 • 5 Keys to a High-Impact Cover Letter" data-uuid="38a54000-ecae-11ea-a225-1d165e8d9620"><!-- wp:easyteachlms/lesson-content {"title":"5 Keys to a High-Impact Cover Letter","uuid":"58e5c7e0-ecae-11ea-a699-530a3e4ab3c6"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="5 Keys to a High-Impact Cover Letter" data-uuid="58e5c7e0-ecae-11ea-a699-530a3e4ab3c6"><!-- wp:embed {"url":"https://vimeo.com/190311959","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/190311959
</div></figure>
<!-- /wp:embed --></div>
<!-- /wp:easyteachlms/lesson-content --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/lesson {"title":" Part 4 • 8 Winning Resume Rules","uuid":"69631ff0-ecae-11ea-a225-1d165e8d9620"} -->
<div class="wp-block-easyteachlms-lesson" data-title=" Part 4 • 8 Winning Resume Rules" data-uuid="69631ff0-ecae-11ea-a225-1d165e8d9620"><!-- wp:easyteachlms/lesson-content {"title":"8 Winning Resume Rules","uuid":"860bdb10-ecae-11ea-a699-530a3e4ab3c6"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="8 Winning Resume Rules" data-uuid="860bdb10-ecae-11ea-a699-530a3e4ab3c6"><!-- wp:embed {"url":"https://vimeo.com/190312039","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/190312039
</div></figure>
<!-- /wp:embed --></div>
<!-- /wp:easyteachlms/lesson-content --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/lesson {"title":"Part 5 • 7 Tips for Successful Interviews","uuid":"a2ef7c50-ecae-11ea-a225-1d165e8d9620"} -->
<div class="wp-block-easyteachlms-lesson" data-title="Part 5 • 7 Tips for Successful Interviews" data-uuid="a2ef7c50-ecae-11ea-a225-1d165e8d9620"><!-- wp:easyteachlms/lesson-content {"title":"7 Tips for Successful Interviews","uuid":"a735ffa0-ecae-11ea-a699-530a3e4ab3c6"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="7 Tips for Successful Interviews" data-uuid="a735ffa0-ecae-11ea-a699-530a3e4ab3c6"><!-- wp:embed {"url":"https://vimeo.com/190312111","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/190312111
</div></figure>
<!-- /wp:embed --></div>
<!-- /wp:easyteachlms/lesson-content --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/lesson {"postId":292,"lastUpdated":"2020-10-06T16:59:58","title":"Part 6 • 7 Keys to Negotiate Your Dream Job","uuid":"c4d7c0c0-ecae-11ea-a225-1d165e8d9620"} -->
<div class="wp-block-easyteachlms-lesson" data-title="Part 6 • 7 Keys to Negotiate Your Dream Job" data-uuid="c4d7c0c0-ecae-11ea-a225-1d165e8d9620"><!-- wp:easyteachlms/lesson-content {"title":"7 Keys to Negotiate Your Dream Job","uuid":"c7fc3240-ecae-11ea-a699-530a3e4ab3c6"} -->
<div class="wp-block-easyteachlms-lesson-content" data-title="7 Keys to Negotiate Your Dream Job" data-uuid="c7fc3240-ecae-11ea-a699-530a3e4ab3c6"><!-- wp:embed {"url":"https://vimeo.com/190312942","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/190312942
</div></figure>
<!-- /wp:embed -->

<!-- wp:file {"id":165,"href":"https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Cover-letter-template.pdf"} -->
<div class="wp-block-file"><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Cover-letter-template.pdf">CB-Cover-letter-template</a><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Cover-letter-template.pdf" class="wp-block-file__button" download>Download</a></div>
<!-- /wp:file -->

<!-- wp:file {"id":164,"href":"https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Interview-Checklist.pdf"} -->
<div class="wp-block-file"><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Interview-Checklist.pdf">CB-Interview-Checklist</a><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Interview-Checklist.pdf" class="wp-block-file__button" download>Download</a></div>
<!-- /wp:file -->

<!-- wp:file {"id":166,"href":"https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Resume-Template.pdf"} -->
<div class="wp-block-file"><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Resume-Template.pdf">CB-Resume-Template</a><a href="https://beta.easyteachlms.com/wp-content/uploads/2020/09/CB-Resume-Template.pdf" class="wp-block-file__button" download>Download</a></div>
<!-- /wp:file --></div>
<!-- /wp:easyteachlms/lesson-content --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/lesson {"postId":292,"lastUpdated":"2020-10-06T16:59:58","title":"Final Quiz","uuid":"6bb83b70-07f5-11eb-9f92-75818ed3d590"} -->
<div class="wp-block-easyteachlms-lesson" data-title="Final Quiz" data-uuid="6bb83b70-07f5-11eb-9f92-75818ed3d590"><!-- wp:easyteachlms/quiz {"title":"Essential Career Builder Course Quiz","uuid":"1e517bf0-ecaf-11ea-9cbe-d13cbb5623f3"} -->
<div class="wp-block-easyteachlms-quiz" data-title="Essential Career Builder Course Quiz" data-uuid="1e517bf0-ecaf-11ea-9cbe-d13cbb5623f3"><!-- wp:easyteachlms/question {"question":"Personal branding and career objectives will never have the same purpose."} -->
<!-- wp:easyteachlms/answer {"answer":"True"} /-->

<!-- wp:easyteachlms/answer {"answer":"False","isCorrect":true} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"Humility and integrity are overrated. It's important to fake it until you make it or you'll never get the job."} -->
<!-- wp:easyteachlms/answer {"answer":"True"} /-->

<!-- wp:easyteachlms/answer {"answer":"False","isCorrect":true} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"Alignment of your personal mission and values with the right team or project increases your odds for success."} -->
<!-- wp:easyteachlms/answer {"answer":"True","isCorrect":true} /-->

<!-- wp:easyteachlms/answer {"answer":"False"} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"A short-term plan is less important than a long-term plan."} -->
<!-- wp:easyteachlms/answer {"answer":"True"} /-->

<!-- wp:easyteachlms/answer {"answer":"False","isCorrect":true} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"If you put your resume out once a week or ask a friend to send a few referrals, good things will happen."} -->
<!-- wp:easyteachlms/answer {"answer":"True"} /-->

<!-- wp:easyteachlms/answer {"answer":"False","isCorrect":true} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"It's important to know why, where, how and when you intend to network for your next project or career opportunity."} -->
<!-- wp:easyteachlms/answer {"answer":"True","isCorrect":true} /-->

<!-- wp:easyteachlms/answer {"answer":"False"} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"You don't ever need a cover letter if your resume says everything an employer need to know."} -->
<!-- wp:easyteachlms/answer {"answer":"True"} /-->

<!-- wp:easyteachlms/answer {"answer":"False","isCorrect":true} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"Using words in your cover letter that are in alignment with the job description will help recruiters and employers know you've done your homework."} -->
<!-- wp:easyteachlms/answer {"answer":"True","isCorrect":true} /-->

<!-- wp:easyteachlms/answer {"answer":"False"} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"It's usually okay to list your skills and experience in a simple e-mail without writing a formal resume because employers are too busy to read formal stuff."} -->
<!-- wp:easyteachlms/answer {"answer":"True"} /-->

<!-- wp:easyteachlms/answer {"answer":"False","isCorrect":true} /-->
<!-- /wp:easyteachlms/question -->

<!-- wp:easyteachlms/question {"question":"Your resume will look more well-rounded if you include specific skills, passions, affiliations, awards and achievements."} -->
<!-- wp:easyteachlms/answer {"answer":"True","isCorrect":true} /-->

<!-- wp:easyteachlms/answer {"answer":"False"} /-->
<!-- /wp:easyteachlms/question --></div>
<!-- /wp:easyteachlms/quiz --></div>
<!-- /wp:easyteachlms/lesson -->

<!-- wp:easyteachlms/certificate {"uuid":"5379c360-0112-11eb-973a-ebbe438cb612"} -->
<div class="wp-block-easyteachlms-certificate" style="border:4px solid;border-color:;background-color:;height:773px;width:1000px;padding:1em;margin-top:1em"><!-- wp:spacer {"height":170} -->
<div style="height:170px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:heading -->
<h2>Certificate of Completion</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4>Getting started with EasyTeach LMS</h4>
<!-- /wp:heading -->

<!-- wp:easyteachlms/certificate-date -->
<div class="wp-block-easyteachlms-certificate-date">Cert Date</div>
<!-- /wp:easyteachlms/certificate-date -->

<!-- wp:easyteachlms/certificate-student -->
<div class="wp-block-easyteachlms-certificate-student">Student Name</div>
<!-- /wp:easyteachlms/certificate-student --></div>
<!-- /wp:easyteachlms/certificate --></div>
<!-- /wp:easyteachlms/course -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->`;

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
            style={{ minWidth: '90vw', width: '100%' }}
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
                        width: '50%',
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
                <div style={{ width: '50%', paddingLeft: '1em' }}>
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

const Tutorial = ({
    open = false,
    toggleOpen,
    enableExample = false,
    courseClientId,
}) => {
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
                        videoSrc={lessonsVideo}
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
                                blocks, the EASY + button is the key to adding
                                multi-media content of all kinds – anything from
                                YouTube videos to links, text, images,
                                downloads, and much more.
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
                        videoSrc={lessonsVideo}
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
                            LESSON OR CERTIFICATE” and then select “LESSON” to
                            create a new Lesson. You’ll then have the option to
                            “START A NEW LESSON” or “SEARCH FOR AN EXISTING
                            LESSON” that you previously created in another
                            course (Learn more about “DUPLICATE-CONTENT” &
                            “DUPLICATE-COURSE” FEATURES HERE).
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
                        videoSrc={contentVideo}
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
                                STEP 2: Click the EASY + button and select your
                                item from the pop-up box -- OR -- click “Browse
                                All” to see all options. Select Vimeo, paste
                                your URL in the box labeled “Enter URL to embed
                                here,” then click the Embed button and just like
                                that, you’ve added a video to your course.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Add any kind of course content!"
                        videoSrc={contentVideo}
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
                                click your EASY “ADD CONTENT of QUIZ” button ,
                                select your item from the pop-up box, OR click
                                “Browse All” to see all options.
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
                        videoSrc={quizVideo}
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
                                CONTENT OR QUIZ” button and select QUIZ from the
                                pop-up box.
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
                                    the Smiley Face to indicate the correct
                                    answer. When the SMILEY FACE is White on a
                                    Black Background, your answer is marked as
                                    the correct answer . When you choose
                                    MULTIPLE as the QUESTION TYPE, you can
                                    indicate multiple-correct answers using the
                                    SMILEY FACE
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
                                        Click on the Smiley Face to indicate
                                        which answer is correct. In our example,
                                        we would click the SMILEY FACE on the
                                        answer FALSE.
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
                                Check out our BuddyPress integration (
                                <a href="#">
                                    CLICK HERE TO LEARN MORE - COMING SOON
                                </a>
                                ) with robust features to manage your students
                                and their progress.
                            </li>
                        </ul>
                    </Page>

                    <Page
                        title="Duplicate Lessons and Content"
                        videoSrc={savingLessonsVideo}
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
                                The EASY + icon will always open a pop-up with
                                your recently-used blocks. Click "Browse All" to
                                access all available blocks.
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
                                        <br />
                                        <br />
                                        <LoadExample
                                            courseClientId={courseClientId}
                                            template={simpleExample}
                                        />
                                    </li>
                                    <li>
                                        Option 2: Advanced Course with Multiple
                                        Lesson Blocks + Multiple Content Blocks
                                        + Multiple Quizzes.
                                        <br />
                                        <br />
                                        <LoadExample
                                            courseClientId={courseClientId}
                                            template={complexExample}
                                        />
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

const TutorialButton = ({
    disable = false,
    enableExample = false,
    courseClientId,
}) => {
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
                courseClientId={courseClientId}
                open={open}
                toggleOpen={toggleOpen}
                enableExample={enableExample}
            />
        </Fragment>
    );
};

export { Tutorial, TutorialButton };
export default TutorialButton;
