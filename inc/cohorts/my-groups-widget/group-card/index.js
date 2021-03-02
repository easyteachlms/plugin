/* eslint-disable camelcase */
/**
 * WordPress Dependencies:
 */
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
    BaseControl,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexItem,
    FlexBlock,
} from '@wordpress/components';

/** Internal Dependencies: */
import Group from './group';

const { apiRequest } = window.bp;

const GroupCard = ({ id, name }) => {
    const [groupData, setGroupData] = useState(false);

    // @todo move this function into something higher leve.
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
                <Group data={groupData} />
            </CardBody>
        </Card>
    );
};

export default GroupCard;
