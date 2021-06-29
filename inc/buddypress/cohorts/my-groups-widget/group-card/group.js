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
    HorizontalRule,
    Modal,
    TabPanel,
    Notice,
} from '@wordpress/components';

/**
 * External Dependencies
 */
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

/**
 * Internal Dependencies
 */

import MembersTable from './members-table';

const Divider = () => {
    return (
        <HorizontalRule
            style={{
                marginLeft: '-24px',
                marginRight: '-24px',
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
            }}
        />
    );
};

const TotalGroupProgress = ({ data, setSortBy }) => {
    console.log('TotalGroupProgress', data);
    return (
        <BaseControl label="Group Members Who Have Completed All Course Work">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Bar
                            dataKey="value"
                            onClick={({ name }) => {
                                setSortBy(name);
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </BaseControl>
    );
};

const Group = ({ data }) => {
    const [sortBy, setSortBy] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [chartData, setChartData] = useState([
        {
            name: 'Completed',
            value: 0,
            fill: 'var(--wp-admin-theme-color)',
        },
        {
            name: 'Incomplete',
            value: 0,
            fill: 'var(--wp-admin-theme-color-darker-20)',
        },
    ]);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const { name, link } = data;

    const LastActivity = () => {
        if (!data.hasOwnProperty('last_activity_diff')) {
            return <Fragment />;
        }
        const { last_activity_diff } = data;
        return (
            <Notice status="warning" isDismissible={false}>
                <strong>Last Activity:</strong> {last_activity_diff}
            </Notice>
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

    useEffect(() => {
        const chartDataMembers = {
            total: 0,
            complete: 0,
            incomplete: 0,
        };
        console.log('chartDataMembers', data);

        if (false !== data) {
            const { groupProgress } = data;
            Object.keys(groupProgress).map((memberId) => {
                let completed = 0;
                let total = 0;
                Object.keys(groupProgress[memberId]).forEach((courseId) => {
                    if (true === groupProgress[memberId][courseId].complete) {
                        completed += 1;
                    }
                    total += 1;
                });

                if (completed === total) {
                    chartDataMembers.complete += 1;
                } else {
                    chartDataMembers.incomplete += 1;
                }
                chartDataMembers.total += 1;
            });
            setChartData([
                {
                    name: 'Completed',
                    value: chartDataMembers.complete,
                    fill: 'var(--wp-admin-theme-color)',
                },
                {
                    name: 'Incomplete',
                    value: chartDataMembers.incomplete,
                    fill: 'var(--wp-admin-theme-color-darker-20)',
                },
            ]);
        }
    }, [data]);

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
            <Button
                isSecondary
                disabled={false === data}
                isBusy={false === data}
                onClick={() => {
                    window.location = link;
                }}
                style={{ marginLeft: '8px' }}
            >
                View Group
            </Button>
            {isOpen && (
                <Modal
                    title={name}
                    onRequestClose={closeModal}
                    className="group-glance-modal"
                >
                    <Fragment>
                        <LastActivity />
                        <TotalGroupProgress
                            data={chartData}
                            setSortBy={setSortBy}
                        />
                        <Description />
                        <Divider />
                        <MembersTable groupData={data} sortBy={sortBy} />
                    </Fragment>
                </Modal>
            )}
        </Fragment>
    );
};

export default Group;
