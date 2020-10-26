import { Table } from 'semantic-ui-react';
import { Fragment } from '@wordpress/element';

const CourseTable = ({ tableData }) => {
    const headerRow = ['Title', 'Type', 'Completed'];

    const renderBodyRow = ({ title, completed, type }, i) => {
        if (
            undefined !== title &&
            0 !== title.length &&
            undefined !== type &&
            ['lesson-content', 'quiz'].includes(type)
        ) {
            return {
                key: `row-${i}`,
                cells: [
                    {
                        key: `title-${i}`,
                        positive: completed,
                        content: title,
                    },
                    {
                        key: `type-${i}`,
                        positive: completed,
                        content:
                            'lesson-content' === type
                                ? 'Lesson Content'
                                : 'Quiz',
                    },
                    {
                        key: `completed-${i}`,
                        positive: completed,
                        content: completed ? 'Completed' : 'Not Yet Completed',
                    },
                ],
            };
        }
        return {};
    };

    return (
        <Fragment>
            <Table
                celled
                headerRow={headerRow}
                renderBodyRow={renderBodyRow}
                tableData={tableData}
            />
        </Fragment>
    );
};

export default CourseTable;
