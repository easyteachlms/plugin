/* eslint-disable camelcase */
// A group modal that when clicked on will display a list of users and a chart at the top showing the overview.
/**
 * WordPress Dependencies:
 */
import { Fragment, useState, useEffect, RawHTML } from '@wordpress/element';
import {
    BaseControl,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexItem,
    FlexBlock,
    Modal,
    TabPanel,
} from '@wordpress/components';

import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const CompletionMiniChart = () => {
    const data = [
        { name: 'Not Yet Finished', value: 30 },
        { name: 'Finished', value: 10 },
    ];
    return (
        <div style={{ width: '100%', height: 150 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie dataKey="value" data={data} fill="#8884d8" label />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const GroupModal = ({ data }) => {
    const [isOpen, setOpen] = useState(false);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    console.log('GroupModal', data);

    const { name } = data;

    const LastActivity = () => {
        if (!data.hasOwnProperty('last_activity_diff')) {
            return <Fragment />;
        }
        const { last_activity_diff } = data;
        return (
            <div>
                <strong>Last Activity:</strong> {last_activity_diff}
            </div>
        );
    };

    const Description = () => {
        const { description } = data;
        if (!description.hasOwnProperty('rendered')) {
            return <Fragment />;
        }
        return (
            <Fragment>
                <p>
                    <strong>Description:</strong>
                </p>
                <RawHTML>{description.rendered}</RawHTML>
            </Fragment>
        );
    };

    const QuickStats = () => {
        if (!data.hasOwnProperty('total_member_count')) {
            return <Fragment />;
        }
        const { total_member_count } = data;
        return (
            <Fragment>
                <div>
                    <p>
                        <strong>Quick Stats:</strong>
                    </p>
                </div>
                <Flex align="center">
                    <FlexItem>
                        <h2>
                            Total Members
                            <br />
                            {total_member_count}
                        </h2>
                    </FlexItem>
                    <FlexItem>
                        <h2>
                            Courses
                            <br />
                            {total_member_count}
                        </h2>
                    </FlexItem>
                    <FlexBlock>
                        <CompletionMiniChart />
                    </FlexBlock>
                </Flex>
            </Fragment>
        );
    };

    return (
        <Fragment>
            <Button
                isPrimary
                disabled={false === data}
                isBusy={false === data}
                onClick={openModal}
            >
                View Group Details
            </Button>
            {isOpen && (
                <Modal
                    title={name}
                    onRequestClose={closeModal}
                    className="group-glance-modal"
                >
                    <Fragment>
                        <LastActivity />
                        <QuickStats />
                        <Description />
                        <p>
                            Table view of users in this group with a pie chart
                            showing percent started, in-progress and completed
                            uuids for all courses?.
                        </p>
                    </Fragment>
                </Modal>
            )}
        </Fragment>
    );
};

export default GroupModal;
