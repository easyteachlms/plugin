import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Button } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

const { easyTeachSettings } = window;

const Enroll = ({ courseId }) => {
    const { userData } = window;
    const { id } = userData;
    const [enrolling, setEnrolling] = useState(false);
    const { enroll } = useDispatch('easyteachlms/course');
    const allowEnrollment = easyTeachSettings.openEnrollment;

    const clickHandler = () => {
        setEnrolling(true);
        apiFetch({
            path: `/easyteachlms/v3/course/enroll/?userId=${id}&courseId=${courseId}`,
            method: 'POST',
            data: { enrolled: true },
        }).then((res) => {
            console.log(res);
            setTimeout(() => {
                setEnrolling(false);
                enroll(true);
            }, 1000);
        });
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h1>Not authorized</h1>
            <p>You are currently not enrolled in this course</p>
            {allowEnrollment && (
                <Button primary onClick={clickHandler} loading={enrolling}>
                    Enroll
                </Button>
            )}
        </div>
    );
};

export default Enroll;
