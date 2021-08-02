/* eslint-disable react/jsx-curly-brace-presence */
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
import { Modal, Button, List } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

import CourseTable from './course-table';

const ViewStudentProgressButton = ({ userSlug, groupId }) => {
    const [open, setOpen] = useState(false);
    const [courses, setCourses] = useState(false);

    const getAttachedCourses = () => {
        return new Promise((resolve) => {
            apiFetch({
                path: `/easyteachlms/v4/cohort/get-courses/?groupId=${groupId}`,
            }).then((r) => {
                console.log(r);
                resolve(r);
            });
        });
    };

    const getStudentInfo = () => {
        return new Promise((resolve) => {
            getAttachedCourses().then((courseIds) => {
                console.log(courseIds);
                apiFetch({
                    path: `/easyteachlms/v4/student/get/?userSlug=${userSlug}`,
                }).then((r) => {
                    console.log('getStudentInfo -- View Progress', r);
                    const toReturn = r.courses.filter((c) => {
                        return Object.values(courseIds).includes(c.id);
                    });
                    resolve(toReturn);
                });
            });
        });
    };

    useEffect(() => {
        getStudentInfo();
    }, [userSlug]);

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
                            getStudentInfo().then((c) => {
                                setCourses(c);
                                setOpen(!open);
                            });
                        }}
                    >
                        View Progress
                    </Button>
                }
            >
                <Modal.Header>Student Progress</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>
                            View this {`student's`} progress across all group
                            courses.
                        </p>
                    </Modal.Description>
                    <List>
                        {false !== courses &&
                            courses.map((e) => {
                                return (
                                    <List.Item>
                                        <List.Header>
                                            <a href={e.link}>{e.title}</a>
                                        </List.Header>
                                        <CourseTable
                                            tableData={e.outline.flat}
                                        />
                                    </List.Item>
                                );
                            })}
                    </List>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="black"
                        onClick={() => {
                            window.location.href = `http://easyteach.local/members/srubenstein/messages/compose/?r=${userSlug}`;
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
