// Click handler
// Fetch user info from rest api
// Modal that displays Student Name
// - Course view component, prop for course ids and user id then goes and get a list of courses with total progress, each item and whether it is complete or not, quiz grades.
// - Progress in this group tab
// - Uses the course view component for courses in this group
//
// - Progress globally tab
// -- Cals the course view component for all enrolled courses for this user
// -
// - A button to message through buddypress.

// A component for the group that would let you see a leaderboard of students grades. Another button that would display the students overall grade in the course.

import { Fragment, useState, useEffect } from '@wordpress/element';
import { Modal, Button, Tab } from 'semantic-ui-react';

const ViewStudentProgressButton = ({ userId, groupId }) => {
    const [open, setOpen] = useState(false);

    const panes = [
        {
            menuItem: 'Assigned Course(s) Progress',
            render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>,
        },
        {
            menuItem: 'All Enrolled Course(s) Progress',
            render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
        },
    ];

    return (
        <Fragment>
            <Modal
                closeIcon
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                    <Button
                        as="div"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        Manage Student
                    </Button>
                }
            >
                <Modal.Header>Student Progress</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>
                            A table displaying this students progress for all
                            enrolled and all assigned courses will appear here.
                            Charts to come later.
                        </p>
                    </Modal.Description>
                    <Tab menu={{ secondary: true }} panes={panes} />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="black"
                        onClick={() => {
                            window.location.href =
                                'http://easyteach.local/members/srubenstein/messages/compose/?r=john-doe';
                        }}
                    >
                        Message Student
                    </Button>
                </Modal.Actions>
            </Modal>
        </Fragment>
    );
};

export default ViewStudentProgressButton;
