/* eslint-disable camelcase */
/**
 * WordPress Dependencies:
 */
import { Fragment, useState, useEffect } from '@wordpress/element';
import { BaseControl, Flex, FlexItem, FlexBlock } from '@wordpress/components';

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

import GroupCard from '../group-card';

const { userId } = window.myGroupsWidget;
const { apiRequest } = window.bp;

const AllGroupsOverviewChart = () => {
    const data = [
        {
            name: 'A new bp 7.0 group',
            totalMembers: 40,
            completed: 15,
        },
        {
            name: 'Test Cohort Group',
            totalMembers: 100,
            completed: 60,
        },
    ];

    return (
        <BaseControl label="Members Who Have Completed All Courses">
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

const MyGroups = () => {
    const [groups, setGroups] = useState(false);
    const getGroups = () => {
        apiRequest({
            path: '/buddypress/v1/groups',
            type: 'GET',
            data: {
                context: 'view',
                user_id: userId,
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

export default MyGroups;
