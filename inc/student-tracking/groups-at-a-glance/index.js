/* eslint-disable camelcase */
/**
 * WordPress Dependencies:
 */
import { Fragment, render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import {
    BaseControl,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexItem,
    FlexBlock,
} from '@wordpress/components';

/**
 * External Dependencies
 */

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

/**
 * Internal Dependencies
 */

import GroupModal from './modal';

import './style.scss';

const { userId } = window.groupsAtGlanceWidget;
const { apiRequest } = window.bp;

const AllGroupsOverviewChart = () => {
    const data = [
        {
            name: 'Group A',
            totalMembers: 100,
            completed: 30,
        },
        {
            name: 'Group B',
            totalMembers: 100,
            completed: 30,
        },
        {
            name: 'Group C',
            totalMembers: 100,
            completed: 30,
        },
        {
            name: 'Group D',
            totalMembers: 100,
            completed: 5,
            fill: 'red',
        },
        {
            name: 'Group E',
            totalMembers: 100,
            completed: 30,
        },
        {
            name: 'Group F',
            totalMembers: 100,
            completed: 40,
        },
        {
            name: 'Group G',
            totalMembers: 100,
            completed: 80,
            fill: 'green',
        },
    ];

    return (
        <BaseControl label="Students Who Have Completed All Course Work">
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis dataKey="completed" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </BaseControl>
    );
};

const GroupCard = ({ id, name }) => {
    const [groupData, setGroupData] = useState(false);

    const getGroupData = () => {
        apiRequest({
            path: `/buddypress/v1/groups/${id}`,
            type: 'GET',
            data: {
                context: 'view',
                populate_extras: true,
            },
        })
            .done(function (data) {
                setGroupData(data[0]);
            })
            .fail(function (error) {
                alert(error.message);
            });
    };

    useEffect(() => {
        getGroupData();
    }, []);

    return (
        <Card
            size="small"
            style={{
                marginTop: '1em',
            }}
        >
            <CardHeader>
                <strong>{name}</strong>
            </CardHeader>
            <CardBody>
                <GroupModal data={groupData} />
            </CardBody>
        </Card>
    );
};

const GroupsAtAGlance = ({ currentUserId }) => {
    const [groups, setGroups] = useState(false);
    const getGroups = () => {
        apiRequest({
            path: '/buddypress/v1/groups',
            type: 'GET',
            data: {
                context: 'view',
                user_id: currentUserId,
            },
        })
            .done(function (data) {
                console.log('My Groups...', data);
                setGroups(data);
            })
            .fail(function (error) {
                alert(error.message);
            });
    };
    useEffect(() => {
        getGroups();
    }, []);
    return (
        <Fragment>
            <AllGroupsOverviewChart />
            {false !== groups &&
                groups.map((g) => {
                    const { id, name } = g;
                    return <GroupCard id={id} name={name} />;
                })}
        </Fragment>
    );
};

domReady(() => {
    const attach = document.getElementById('groups-at-a-glance-widget-render');
    console.log('READY');
    if (attach) {
        render(<GroupsAtAGlance currentUserId={userId} />, attach);
    }
});
