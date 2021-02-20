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

const TotalGroupProgress = () => {
    const data = [
        {
            name: 'Completed',
            value: 30,
            fill: 'var(--wp-admin-theme-color)',
        },
        {
            name: 'Incomplete',
            value: 10,
            fill: 'var(--wp-admin-theme-color-darker-20)',
        },
    ];
    return (
        <BaseControl label="Group Course Work">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Bar
                            dataKey="value"
                            onClick={(d) => {
                                console.log(d.name);
                                if ('Completed' === d.name) {
                                    alert(
                                        'Filtering to show students who have completed all uuids...(tktktk)',
                                    );
                                } else {
                                    alert(
                                        'Filtering to show students WHO HAVE NOT COMPLETED all uuids...(tktktk)',
                                    );
                                }
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </BaseControl>
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
                        <TotalGroupProgress />
                        <Description />
                        <Divider />
                        <MembersTable groupData={data} />
                    </Fragment>
                </Modal>
            )}
        </Fragment>
    );
};

export default GroupModal;
