import { Fragment, useState, useEffect } from '@wordpress/element';
import { Modal, Button, List } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

const ViewStudentNotifications = ({ userSlug, groupId }) => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAttachedCourses = () => {
        return new Promise((resolve) => {
            apiFetch({
                path: `/easyteachlms/v3/cohort/get-courses/?groupId=${groupId}`,
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
                    path: `/easyteachlms/v3/student/get/?userSlug=${userSlug}`,
                }).then((r) => {
                    console.log('getStudentInfo - View Notifications', r);
                    setUserData(r.userData);
                    const coursesEnrolled = r.courses.filter((c) => {
                        return Object.values(courseIds).includes(c.id);
                    });
                    const data = [];
                    // Construct the data object here combine the course title and quiz title and questions
                    coursesEnrolled.forEach((d) => {
                        if (d.id in r.notifications) {
                            const n = {
                                courseTitle: d.title,
                                courseId: d.id,
                                data: r.notifications[d.id],
                            };
                            data.push(n);
                        }
                    });
                    resolve(data);
                });
            });
        });
    };

    const finishGradingQuiz = (
        passed = false,
        pointsToAward = 0,
        currentScore = 0,
        uuid,
        courseId,
    ) => {
        let newScore = currentScore;
        // Get existing userScore Data
        if (true === passed) {
            newScore = currentScore + pointsToAward;
        }
        // Check if quiz has any free text answers and if so we need to grade the quiz differently. And display different warnings on completion.
        apiFetch({
            path: `/easyteachlms/v3/quiz/submit/?userId=${userData.ID}&uuid=${uuid}&courseId=${courseId}&newScore=${newScore}`,
            method: 'POST',
        }).then((d) => {
            console.log(d);
            const tmpData = notifications;
            tmpData.forEach((tmp, index) => {
                if (courseId === tmp.courseId) {
                    // Do Something;
                    // Filters notifications[courseId].data to remove the uuid, then return new data to setNotifications to.
                    delete tmp.data[uuid];
                    console.log(Object.keys(tmp.data).length);
                    if (0 <= Object.keys(tmp.data).length) {
                        delete tmpData[index];
                    }
                }
            });
            console.log('new Data');
            console.log(tmpData.length);
            if (1 <= tmpData.length) {
                setOpen(false);
                setNotifications(false);
            } else {
                setNotifications([...tmpData]);
            }
        });
    };

    const QuizResponses = ({ questions, courseId }) => {
        const toReturn = [];
        console.log(questions);
        const values = Object.keys(questions);
        values.forEach((uuid) => {
            const q = questions[uuid];
            q.data.forEach((qs) => {
                toReturn.push(
                    <Fragment>
                        <div>
                            <p>
                                <strong>Question:</strong>
                            </p>
                            <p>{qs.question}</p>
                        </div>
                        <div>
                            <p>
                                <strong>Answer:</strong>
                            </p>
                            <textarea disabled>{qs.givenAnswer}</textarea>
                        </div>
                        <p>Is this response correct?</p>
                        <Button
                            positive
                            onClick={() =>
                                finishGradingQuiz(
                                    true,
                                    qs.points,
                                    q.score,
                                    uuid,
                                    courseId,
                                )
                            }
                        >
                            Yes
                        </Button>
                        <Button
                            negative
                            onClick={() => {
                                finishGradingQuiz(
                                    false,
                                    qs.points,
                                    q.score,
                                    uuid,
                                    courseId,
                                );
                            }}
                        >
                            No
                        </Button>
                    </Fragment>,
                );
            });
        });
        return toReturn;
    };

    return (
        <Fragment>
            <Modal
                closeIcon
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                    <Button
                        color="yellow"
                        as="div"
                        onClick={() => {
                            getStudentInfo().then((c) => {
                                setNotifications(c);
                                setOpen(!open);
                            });
                        }}
                    >
                        Notification
                    </Button>
                }
            >
                <Modal.Header>Grade Quiz</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>Student has quiz answers that require attention:</p>
                    </Modal.Description>
                    <List divided relaxed>
                        {false !== notifications &&
                            notifications.map((n) => {
                                console.log('Notification Map:', n);
                                const questions = n.data;
                                return (
                                    <List.Item>
                                        <h4>{n.courseTitle}</h4>
                                        <QuizResponses
                                            questions={questions}
                                            courseId={n.courseId}
                                        />
                                    </List.Item>
                                );
                            })}
                    </List>
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

export default ViewStudentNotifications;
