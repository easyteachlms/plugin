import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Button } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

const { easyTeachSettings } = window;
const { openEnrollment } = easyTeachSettings;

const Enroll = ({ courseId }) => {
    const { userData } = window;
    const { id } = userData;
    const [enrolling, setEnrolling] = useState(false);
    const { enroll } = useDispatch('easyteachlms/course');
    console.log('User ID', id);
    const clickHandler = () => {
        setEnrolling(true);
        apiFetch({
            path: `/easyteachlms/v4/course/enroll/?userId=${id}&courseId=${courseId}`,
            method: 'POST',
            data: { enrolled: true },
        })
            .then(() => {
                setTimeout(() => {
                    enroll(true);
                    setEnrolling(false);
                }, 1000);
            })
            .catch((e) => {
                if ('rest_forbidden' === e.code) {
                    apiFetch({
                        path: `/easyteachlms/v4/course/redirect-to-login/?courseId=${courseId}`,
                        method: 'GET',
                    }).then((url) => {
                        window.location.href = url;
                    });
                }
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
            {openEnrollment && (
                <Button primary onClick={clickHandler} loading={enrolling}>
                    Enroll
                </Button>
            )}
        </div>
    );
};

export default Enroll;
