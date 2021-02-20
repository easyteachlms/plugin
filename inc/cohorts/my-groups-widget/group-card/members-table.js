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
    Flex,
    FlexItem,
    FlexBlock,
    TabPanel,
    Notice,
} from '@wordpress/components';

import { Icon, people } from '@wordpress/icons';

import { random, name } from 'faker';

/**
 * External Dependencies
 */
// @TODO Later on for optimization https://github.com/jbetancur/react-data-table-component#optimizing-functional-components
import DataTable from 'react-data-table-component';

const ProgressBar = ({ value }) => {
    console.log('<ProgressBar/>', value);
    return (
        <div
            style={{
                backgroundColor: '#e7e8e9',
                paddingRight: `${value}%`,
                width: '100%',
            }}
        >
            <div
                style={{
                    backgroundColor: 'var(--wp-admin-theme-color)',
                    width: '100%',
                    height: '6px',
                }}
            />
        </div>
    );
};

const LessonTable = ({ data }) => {
    const { lessonContents } = data;

    const columns = [
        {
            name: 'Title',
            selector: 'title',
            sortable: true,
        },
        {
            name: 'Satus',
            selector: 'status',
        },
    ];

    return (
        <div style={{ paddingLeft: '3.1rem' }}>
            <DataTable
                columns={columns}
                data={lessonContents.map((lesson) => {
                    const { uuid, title } = lesson;
                    return {
                        id: uuid,
                        title,
                        status: 'Incomplete',
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
const CourseTable = ({ data }) => {
    const { outline } = data;

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
                data={Object.keys(outline.structured).map((uuid) => {
                    const s = outline.structured[uuid];
                    const { title } = s;

                    return {
                        id: uuid,
                        title,
                        progress: random.number({ min: 0, max: 80 }), // The aggregate progress of all lesson contents in a lesson in a course
                        lessonContents: Object.keys(s.outline).map(
                            (lessonUuid) => s.outline[lessonUuid],
                        ),
                    };
                })}
                expandableRows
                expandableRowsComponent={<LessonTable />}
                noTableHead
            />
        </div>
    );
};

const Member = ({ data }) => {
    const { userId, courses, courseStructure } = data;
    console.log('Member?', userId, courseStructure);

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
                data={courses.map((courseId) => {
                    const { outline, title } = courseStructure[courseId];
                    return {
                        title,
                        outline,
                        progress: random.number({ min: 40, max: 100 }), // The aggregate progress of all lessons in a course
                    };
                })}
                expandableRows
                expandableRowsComponent={<CourseTable />}
            />
        </div>
    );
};

const MembersTable = ({ groupData }) => {
    // Would be great if we could have a function to GET group data.
    const { members, courses, courseStructure } = groupData;

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
            selector: 'actions',
            cell: (row) => {
                return (
                    <div>
                        <Button isSecondary isSmall>
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
                    data={members.map((userId) => {
                        return {
                            name: name.findName(),
                            userId,
                            courses,
                            courseStructure,
                        };
                    })}
                    expandableRows
                    expandableRowsComponent={<Member />}
                />
            </BaseControl>
        </Fragment>
    );
};

export default MembersTable;
