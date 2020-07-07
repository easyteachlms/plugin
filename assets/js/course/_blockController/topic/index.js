import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, Header, Menu } from 'semantic-ui-react';

const user = window.userData;

const MarkComplete = ({ uuid, userId, courseId, hasQuiz, isComplete }) => {
    const [status, setStatus] = useState(false);
    const { setComplete } = useDispatch('easyteachlms/course');
    return (
        <Button
            size="small"
            color={isComplete ? 'green' : null}
            onClick={() => {
                setStatus(true);
                console.log('COURSE ID');
                console.log(courseId);
                console.log(userId);

                apiFetch({
                    path: `/easyteachlms/v3/student/update-progress/?userId=${userId}&uuid=${uuid}&courseId=${courseId}`,
                    method: 'POST',
                    data: { completed: true },
                }).then((res) => {
                    console.log(res);
                    setTimeout(() => {
                        setStatus(false);
                        setComplete(uuid);
                    }, 1000);
                });
            }}
            loading={status}
            disabled={isComplete}
        >
            Mark Completed {true === hasQuiz && '(Requirement: Complete Quiz)'}
        </Button>
    );
};

const Topic = ({ parentTitle, title, uuid, hasQuiz, className, children }) => {
    const { isComplete, isActive, courseId } = useSelect((select) => {
        const complete = select('easyteachlms/course').isComplete(uuid);
        const active = select('easyteachlms/course').getActive();
        return {
            isComplete: complete,
            isActive: active === uuid,
            courseId: select('easyteachlms/course').getCourseId(),
        };
    }, []);

    if (true !== isActive) {
        return <Fragment />;
    }

    const Toolbar = () => {
        const { id } = user;
        return (
            <Menu style={{ fontSize: '14px' }}>
                <Menu.Item>
                    <MarkComplete
                        uuid={uuid}
                        userId={id}
                        courseId={courseId}
                        hasQuiz={hasQuiz}
                        isComplete={isComplete}
                    />
                </Menu.Item>

                <Menu.Item>Get Help</Menu.Item>
            </Menu>
        );
    };
    // How can we tell if this has a quiz??
    return (
        <Fragment>
            <Header as="h2" dividing>
                {title}
                {false !== parentTitle && (
                    <Header.Subheader>{parentTitle}</Header.Subheader>
                )}
            </Header>
            <div className={className} data-uuid={uuid}>
                {children}
                <Toolbar />
            </div>
        </Fragment>
    );
};

export default Topic;
