/* eslint-disable camelcase */
// A group modal that when clicked on will display a list of users and a chart at the top showing the overview.
/**
 * WordPress Dependencies:
 */
import { Fragment, useState, useEffect, useMemo } from '@wordpress/element';
import {
    Animate,
    BaseControl,
    Button,
    ButtonGroup,
    Modal,
    HorizontalRule,
    Flex,
    FlexItem,
    FlexBlock,
    TabPanel,
    TextareaControl,
    Notice,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
// @TODO Later on for optimization https://github.com/jbetancur/react-data-table-component#optimizing-functional-components
import DataTable from 'react-data-table-component';
import { TextArea } from 'semantic-ui-react';

const ProgressBar = ({ value }) => {
    console.log('<ProgressBar/>', value);
    return (
        <div
            style={{
                backgroundColor: 'var(--wp-admin-theme-color)',
                paddingLeft: `${value}%`,
                width: '100%',
            }}
        >
            <div
                style={{
                    backgroundColor: '#e7e8e9',
                    width: '100%',
                    height: '6px',
                }}
            />
        </div>
    );
};

const GradeQuiz = ({ uuid, courseId, userId, scoreData }) => {
    const [open, toggleOpen] = useState(false);
    const { essayAnswers, pointsRequiredToPass, score, total } = scoreData;

    const finishGradingQuiz = (
        passed = false,
        pointsToAward = 0,
        currentScore = 0,
        essayAnswerIndex,
    ) => {
        let newScore = currentScore;
        // Get existing userScore Data
        if (true === passed) {
            newScore = currentScore + pointsToAward;
        }
        // Check if quiz has any free text answers and if so we need to grade the quiz differently. And display different warnings on completion.
        apiFetch({
            path: `/easyteachlms/v3/student/update-quiz-progress/?userId=${userId}&uuid=${uuid}&courseId=${courseId}&newScore=${newScore}&essayAnswer=${essayAnswerIndex}`,
            method: 'POST',
        }).then((d) => {
            console.log(d);
        });
    };

    return (
        <Fragment>
            {true === open && (
                <Modal
                    title="Grade Quiz"
                    onRequestClose={() => toggleOpen(false)}
                    className="quiz-grading-modal"
                >
                    <p>
                        <strong>Current Points Awarded:</strong> {score}
                    </p>
                    <p>
                        <strong>Total Points Available:</strong> {total}
                    </p>
                    <p>
                        <strong>Score Required To Pass:</strong>{' '}
                        {pointsRequiredToPass}
                    </p>
                    <HorizontalRule />
                    <ul>
                        {essayAnswers.map((q, index) => {
                            const { question, givenAnswer, points, graded } = q;
                            if (true === graded) {
                                return <Fragment />;
                            }
                            return (
                                <li>
                                    <p>
                                        <BaseControl label="Question:">
                                            <p>
                                                <strong>{question}</strong>
                                            </p>
                                        </BaseControl>
                                    </p>
                                    <p>
                                        <TextareaControl
                                            label="Given Answer:"
                                            disabled
                                            value={givenAnswer}
                                        />
                                    </p>
                                    <ButtonGroup>
                                        <Button
                                            isPrimary
                                            onClick={() => {
                                                finishGradingQuiz(
                                                    true,
                                                    points,
                                                    score,
                                                    index,
                                                );
                                            }}
                                        >
                                            Correct
                                        </Button>
                                        <Button
                                            isDestructive
                                            onClick={() => {
                                                finishGradingQuiz(
                                                    false,
                                                    points,
                                                    score,
                                                    index,
                                                );
                                            }}
                                        >
                                            Incorrect
                                        </Button>
                                    </ButtonGroup>
                                </li>
                            );
                        })}
                    </ul>
                </Modal>
            )}
            <Button
                isSmall
                isSecondary
                onClick={() => {
                    toggleOpen(true);
                }}
            >
                Grade Quiz
            </Button>
        </Fragment>
    );
};

const LessonContents = ({ data }) => {
    const { raw, courseId, userId } = data;
    console.log('LessonContents?', data);

    const columns = [
        {
            name: 'Title',
            selector: 'title',
            sortable: true,
        },
        {
            name: 'Status',
            selector: 'status',
            cell: (row) => {
                return row.status;
            },
        },
    ];

    return (
        <div style={{ paddingLeft: '3.1rem' }}>
            <DataTable
                columns={columns}
                data={Object.keys(raw).map((uuid) => {
                    const { title, complete, type, score } = raw[uuid];
                    let status = complete ? 'Complete' : 'Incomplete';
                    if ('quiz' === type && 'object' === typeof score) {
                        // Determine if there are any essay answers needing to be graded.
                        const needsGrading = score.essayAnswers.filter((e) => {
                            console.log('needGrades??', e);
                            return true !== e.graded;
                        });
                        console.log(
                            'needsGrading?',
                            needsGrading,
                            needsGrading.length,
                        );
                        if (
                            1 >= score.essayAnswers.length &&
                            0 !== needsGrading.length
                        ) {
                            console.log(
                                'Condition 1:',
                                score.essayAnswers.length,
                                1 >= score.essayAnswers.length,
                            );
                            console.log(
                                'Condition 2:',
                                needsGrading,
                                1 >= needsGrading.length,
                            );
                            status = (
                                <GradeQuiz
                                    uuid={uuid}
                                    courseId={courseId}
                                    userId={userId}
                                    scoreData={score}
                                />
                            );
                        }
                    }
                    return {
                        id: uuid,
                        title,
                        status,
                    };
                })}
                noTableHead
            />
        </div>
    );
};

/**
 * Renders a table containing all the lessons, and lesson contents, and progress for a course for a user.
 * @param {*} param0
 */
const Lessons = ({ data }) => {
    const { raw, courseId, userId } = data;
    console.log('Lessons?', data);

    const columns = [
        {
            name: 'Title',
            selector: 'title',
            sortable: true,
        },
        {
            name: 'Progress',
            selector: 'progress',
            cell: (row) => {
                return <ProgressBar value={row.progress} />;
            },
        },
    ];

    return (
        <div style={{ paddingLeft: '3.1rem' }}>
            <DataTable
                columns={columns}
                data={Object.keys(raw).map((uuid) => {
                    const { title, progress } = raw[uuid];
                    console.log('rawUUID', raw[uuid]);
                    const p = (progress.complete / progress.total) * 100;
                    return {
                        id: uuid,
                        title,
                        progress: p,
                        raw: raw[uuid].data,
                        userId,
                        courseId,
                    };
                })}
                expandableRows
                expandableRowsComponent={<LessonContents />}
                noTableHead
            />
        </div>
    );
};

const Courses = ({ data }) => {
    const { raw, userId } = data;

    const columns = [
        {
            name: 'Course Title',
            selector: 'title',
            sortable: true,
        },
        {
            name: 'Progress',
            selector: 'progress',
            cell: (row) => {
                return <ProgressBar value={row.progress} />;
            },
        },
    ];

    return (
        <div style={{ paddingLeft: '3.1rem' }}>
            <DataTable
                columns={columns}
                data={Object.keys(raw).map((courseId) => {
                    const { title, progress } = raw[courseId];
                    const p = (progress.complete / progress.total) * 100;
                    return {
                        title,
                        raw: raw[courseId].data,
                        progress: p, // The aggregate progress of all lessons in a course
                        userId,
                        courseId,
                    };
                })}
                expandableRows
                expandableRowsComponent={<Lessons />}
            />
        </div>
    );
};

const MembersTable = ({ groupData }) => {
    // Would be great if we could have a function to GET group data.
    const { members, groupProgress } = groupData;

    // @TODO Filtering: https://jbetancur.github.io/react-data-table-component/?path=/story/filtering--example-1
    // const filteredItems = members.filter(item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()));

    const columns = [
        {
            name: 'Group Member Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Actions',
            selector: 'messageLink',
            cell: (row) => {
                const { messageLink } = row;
                return (
                    <div>
                        <Button
                            isSecondary
                            isSmall
                            onClick={() => {
                                window.location = messageLink;
                            }}
                        >
                            Contact
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <Fragment>
            <BaseControl label="Members">
                <DataTable
                    columns={columns}
                    data={members.map(({ messageLink, name, userId }) => {
                        return {
                            messageLink,
                            name,
                            raw: groupProgress[userId],
                            userId,
                        };
                    })}
                    expandableRows
                    expandableRowsComponent={<Courses />}
                />
            </BaseControl>
        </Fragment>
    );
};

export default MembersTable;
