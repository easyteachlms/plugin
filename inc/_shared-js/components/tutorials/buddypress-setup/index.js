/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/alt-text */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import './style.scss';

import illustration from './art/basic.png';

const lessonsVideo =
    '//beta.easyteachlms.com/wp-content/uploads/2020/10/Lessons.mp4';
const quizVideo = '//beta.easyteachlms.com/wp-content/uploads/2020/10/Quiz.mp4';
const contentVideo =
    '//beta.easyteachlms.com/wp-content/uploads/2020/10/Content.mp4';

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

const BuddyPressTutorial = ({ open = false, toggleOpen, courseClientId }) => {
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
                        title="Step 1: Install BuddyPress"
                        imgSrc={illustration}
                        activePage={currentPage}
                        pageNumber={1}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            The initial installation of the BuddyPress plugin
                            works like any other WordPress plugin.{' '}
                            <a href="/wp-admin/plugins.php" target="_blank">
                                Click here
                            </a>{' '}
                            to access BuddyPress and complete installation.
                        </p>
                        <p>
                            Want to learn more about plugins and the
                            installation process?{' '}
                            <a
                                href="https://wordpress.org/support/article/managing-plugins/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Check out this guide from WordPress
                            </a>
                        </p>
                    </Page>

                    <Page
                        title="Step 2:  Configure Settings "
                        videoSrc={lessonsVideo}
                        activePage={currentPage}
                        pageNumber={2}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            Once you’ve installed and activated BuddyPress on
                            your WordPress website, you’ll want to configure
                            BuddyPress to suit your needs. Simply navigate to
                            the WordPress Dashboard and click Settings; and then
                            BuddyPress from the left-hand menu. NOTE: You can
                            come back to this menu at any time to make changes
                            or update your settings.
                        </p>
                        <p>
                            On the BuddyPress Settings page, you will see a list
                            of all the BuddyPress Components installed by
                            default with a short explanation next to each
                            Component. Select the ones that you want to use on
                            your website and de-select the rest. Once you’re
                            ready, click “Save Settings.”
                        </p>
                        <p>
                            Next, click the “Options” tab. There you will find
                            additional settings for BuddyPress. Enable the
                            options that best suit your needs and then click
                            “Save Settings.”
                        </p>
                        <p>
                            For more information on BuddyPress and in-depth
                            BuddyPress Tutorials, visit the BuddyPress website
                            or visit the Getting Started section of the
                            BuddyPress Web Support Forum.
                        </p>
                    </Page>

                    <Page
                        title="Step 3:  Create your first group!"
                        videoSrc={lessonsVideo}
                        activePage={currentPage}
                        pageNumber={3}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            BuddyPress uses the term “Group” when referring to
                            any kind of group – such as a class of students, a
                            sales force, business forum, management team, book
                            club, or even a group of yogis. To set up your first
                            group, click on Groups from the left-hand menu of
                            your WordPress Dashboard and then click Groups
                            again. (Click here to go straight to the Add New
                            Group page).
                        </p>
                        <p>
                            Next, click on the “Add New” button at the top of
                            the page. You will then be directed through a series
                            of steps to set up your group.{' '}
                            <ul>
                                <li>
                                    <strong>{`FIRST >> Name Your Group`}</strong>
                                    <br />
                                    Under the details tab, enter your Group Name
                                    and add a Description if you like. These
                                    will both be visible to all members of your
                                    group. Once you have done so, click on
                                    “Create Group and Continue.”
                                </li>
                                <li>
                                    <strong>{`NEXT >> Set Your Visibility and Privacy Settings`}</strong>
                                    <br />
                                    On the next screen you can choose whether
                                    your group will be Public, Private, or
                                    Hidden. You can also dictate who gets to
                                    invite others to the group. Select your
                                    preferred options and then click “Next
                                    Step.”
                                </li>
                                <li>
                                    <strong>{`NEXT >> Add Your Courses`}</strong>
                                    <ul>
                                        <li>
                                            On this page you will find a
                                            dropdown menu where you can easily
                                            add the courses you created for your
                                            group using the EasyTeach LMS Course
                                            Creator.
                                            <br />
                                            <i>
                                                Haven’t created your course,
                                                yet? Please stop and go back to
                                                the Easy Teach LMS Course
                                                Creator to create your first
                                                course.
                                            </i>
                                        </li>
                                        <li>
                                            In the dropdown box under the
                                            “Manage Courses” header, enter the
                                            first few letters of the Course(s)
                                            name(s) that you wish to add and
                                            then select the correct course from
                                            the list. Repeat as many times as
                                            you would like to add all Courses
                                            for the Group. Once you’ve added a
                                            Course, it will appear in the
                                            dropdown box.
                                            <i>
                                                Accidentally added a course to
                                                the Group? No problem. Click the
                                                “X” beside the Course name to
                                                remove it from the Group.
                                            </i>
                                        </li>
                                        <li>
                                            Once you’ve added all of your
                                            Courses, click “Next Step.”
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </p>
                    </Page>

                    <Page
                        title="Step 4 (Optional):  Customize Your Group with an Avatar (profile picture) and a Cover/Header Image."
                        videoSrc={contentVideo}
                        activePage={currentPage}
                        pageNumber={4}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            From the next two screens, use the “Upload”
                            interface to either drag and drop your Avatar
                            (profile picture) or “Select Your File” to upload a
                            photo from your computer. Use the adjustable box to
                            crop your image to the desired size. Once it appears
                            the way you like it in the preview box on the right,
                            click “Crop Image.” For best results, please use an
                            image that is at least 110 pixels wide by 110 pixels
                            tall. Then click “Next Step.”
                        </p>
                        <p>
                            Repeat the process on the next screen to upload the
                            Cover/Header Image for your group. For best results,
                            please use an image that is at least 1300 pixels
                            wide and 225 pixels tall. Once you’re done, click
                            “Next Step.”
                        </p>
                    </Page>

                    <Page
                        title="Step 5:  Add/Invite Members to your Group"
                        videoSrc={contentVideo}
                        activePage={currentPage}
                        pageNumber={5}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            You can send invites to any registered User on your
                            Web site. (Need to add Users who are not registered
                            on your Web Site? Click here to learn more). From
                            this screen, select the Users you wish to invite by
                            clicking the “+” button. Once you've made your
                            selection, click the "Send Invites" tab to continue.
                        </p>
                        <p>
                            From the “Send Invites” tab, add a message to your
                            invite if you wish, then click “Send”
                        </p>
                        <p>
                            Add/Invite Additional Members by clicking the “Back
                            to the Previous Step” button and repeating the
                            selection-and-invite process.
                        </p>
                        <p>Click “Finish” to go to the next step.</p>
                        <h3>
                            BONUS: Adding Members to your group that do not yet
                            have an account on your website.
                        </h3>
                        <p>
                            There are three ways to add users to your group when
                            they do not already have a registered User account
                            on your website.
                        </p>
                        <ol>
                            <li>
                                Add new Users from the User Menu in WordPress.
                                From the WordPress Dashboard, click on “Users”
                                and then “New User” from the left-hand menu.
                                Follow the prompts to add new users to your
                                site. Once they have been added, you can invite
                                them directly from the “Invite” tab of your
                                Group Admin page.
                            </li>
                            <li>
                                Make sure your Group permissions allow anyone to
                                register (Click the “Anyone can register” button
                                from the BuddyPress General Settings tab and
                                then share your Group link with anyone that you
                                would like to invite. Your Group link is found
                                in the URL bar on the home page of your group.
                                Group links are generally as follows:
                                yoursitename.com/groups/group-name, where
                                yoursitename.com is replaced with your site URL,
                                and Group-Name is replaced with the name of your
                                Group.
                            </li>
                            <li>
                                Use a plug in like
                                https://www.buddyboss.com/resources/docs/integrations/buddypress-add-ons/invite-anyone/
                                to directly add emails from the Buddy Press
                                Invite page.{' '}
                            </li>
                        </ol>
                    </Page>

                    <Page
                        title="ACCESSING CONTENT:"
                        videoSrc={quizVideo}
                        activePage={currentPage}
                        pageNumber={6}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            Once they’re invited, your Users will be sent an
                            invitation that reads similar to this:
                        </p>
                        <hr />
                        <p>
                            The Instructor or Administrator has invited you to
                            join the group: "EasyTeach LMS." Go here to accept
                            your invitation or visit the group to learn more.
                        </p>
                        <p>
                            Once your users accept the invite, they will have
                            immediate access to the Group and all of its
                            features. As we are focused on learning – let’s jump
                            straight to the Course tab.
                        </p>
                        <p>
                            The Courses you added to your group in Step 3 above
                            will now show on each User’s Course Dashboard. Users
                            will simply click on the course name and follow the
                            prompts to begin, continue, or complete their
                            courses.
                        </p>
                        <p>
                            For more information and tips for how to make the
                            most of BuddyPress, the group settings, the Activity
                            Walls, and more, please visit BuddyPress
                            Documentation.
                        </p>
                    </Page>

                    <Page
                        title="TEACHER/ADMIN DASHBOARDS | REPORTING:"
                        videoSrc={quizVideo}
                        activePage={currentPage}
                        pageNumber={7}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                    >
                        <p>
                            EasyTeach for Groups has built-in dashboards for
                            teachers and admins to easily keep tabs on their
                            Groups.
                        </p>
                        <p>
                            EasyTeach for Groups makes it easy for Teachers and
                            Administrators to easily keep tabs on their Groups
                            via our handy Reports Dashboard. Conveniently found
                            on your WordPress Dashboard, under the heading “Your
                            Groups at a Glance” you can quickly access your
                            Groups, view Member progress, and grade quizzes.
                        </p>
                        <h3>Access Your Group</h3>
                        <p>
                            To quickly access the home page of your Group, from
                            the Report Dashboard found under the “Your Groups at
                            a Glance” heading on the WordPress Dashboard, simply
                            browse to the Group you would like to access and
                            click on “View Group.” This will take you directly
                            to the primary page of your group.
                        </p>
                        <h3>View Group Details</h3>
                        <p>
                            Also from the Reports Dashboard, you can check on
                            Group Progress as well as drill down to individual
                            student progress. Navigate to the Group you would
                            like to view and click on the button “View Group
                            Details.”
                        </p>
                        <p>
                            On the next screen, you will find a chart that shows
                            overall group progress. The chart at the top will
                            show you how many Group Members have completed their
                            course work as well as how many have not completed
                            their course work.
                        </p>
                        <p>
                            {`As you scroll down the Reports Page to the “Members”
                            section, you will find a list of all the Members in
                            your Group. Click the arrow (>) next to the
                            student’s name to see their progress on each course.
                            Drill down even further by clicking on the arrow (>)
                            next to the Course name to see the Student’s
                            progress on each Lesson.`}
                        </p>
                        <h3>
                            Contact Students in Your Group and Grade Quizzes
                        </h3>
                        <p>
                            You’ll also have the option to quickly contact the
                            student by clicking the “Contact” button in the
                            “Actions” column next to the Student’s name.
                        </p>
                        <p>
                            If a student has submitted a quiz that requires
                            manual grading a “Grade Quiz” button will appear in
                            the “Actions” column. Click this button to open the
                            quiz-grading interface. You will see the original
                            questions, student’s answer, and the total available
                            points. Follow the prompt to grade any essay-styles
                            answers.
                        </p>
                        <p>
                            Note: If no quizzes are available to be graded, the
                            “Grade Quiz” button will not appear.
                        </p>
                        <p>
                            And there you have it! You’ll be in up and running
                            with your Groups in no time!
                        </p>
                    </Page>

                    <Page
                        title="CONCLUSION:"
                        videoSrc={quizVideo}
                        activePage={currentPage}
                        pageNumber={8}
                        goToPage={setCurrentPage}
                        setTitle={setTitle}
                        closeModal={toggleOpen}
                    >
                        <p>
                            You are now set to offer courses to your Groups,
                            Classes, Communities, Departments and so much more.
                            You can dive even further into the many features
                            that BuddyPress has to offer to enhance the Group
                            experience by visiting the BuddyPress site. There
                            you will find resources and guides to help you
                            including:
                            <ul>
                                <li>
                                    <a
                                        href="https://codex.buddypress.org/getting-started/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Getting Started
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://codex.buddypress.org/buddypress-components-and-features/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        List of Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://codex.buddypress.org/administrator-guide/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Administrator Guide
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://codex.buddypress.org/member-guide/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Member (Student) Guide
                                    </a>
                                </li>
                            </ul>
                        </p>
                    </Page>
                </Modal>
            )}
        </Fragment>
    );
};

const BuddyPressTutorialButton = ({ courseClientId }) => {
    const [open, toggleOpen] = useState(false);
    return (
        <Fragment>
            <p>
                The EasyTeach Buddy Press Add-On takes your online learning &
                administration to the next level!
            </p>
            <p>
                With the power of EasyTeach and flexibility of BuddyPress, you
                can offer interactive-online content and e-courses for classes,
                communities, departments, forums and groups of all sizes!
            </p>
            <p>
                You can track student or member progress, facilitate group
                chats, view activity feeds, create discussion boards, and much
                more – all while offering media-rich, easy-to-create online
                courses.
            </p>
            <p>
                Once you’ve created courses using the EasyTeach LMS plugin,
                you’re ready to create your first group.
            </p>
            <Button
                isPrimary
                onClick={() => {
                    toggleOpen(true);
                }}
            >
                {__(`Let's get started!`)}
            </Button>
            <BuddyPressTutorial
                courseClientId={courseClientId}
                open={open}
                toggleOpen={toggleOpen}
            />
        </Fragment>
    );
};

export { BuddyPressTutorial, BuddyPressTutorialButton };
export default BuddyPressTutorialButton;
