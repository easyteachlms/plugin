import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { Button } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

const user = window.userData;
const { id } = user;

const MarkComplete = ({
    uuid,
    userId = id, // We're defaulting to the global scoped current user, however this can be assigned a user id manually - useful for teacher interfaces.
    courseId,
    hasQuiz,
    conditionsMet, // Are the conditions for allowing this to be marked complete met?
    isComplete,
}) => {
    const [status, setStatus] = useState(false);
    const { setComplete } = useDispatch('easyteachlms/course');
    let disabled = false;
    if (true === hasQuiz && true !== conditionsMet) {
        disabled = true;
    } else if (true === isComplete) {
        disabled = true;
    }

    return (
        <Button
            size="small"
            color={isComplete ? 'green' : null}
            onClick={() => {
                setStatus(true);
                apiFetch({
                    path: `/easyteachlms/v3/student/update-progress/?userId=${userId}&uuid=${uuid}&courseId=${courseId}`,
                    method: 'POST',
                    data: { completed: true },
                }).then(() => {
                    setTimeout(() => {
                        setStatus(false);
                        setComplete(uuid);
                    }, 1000);
                });
            }}
            loading={status}
            disabled={disabled}
        >
            Mark Completed
            {true === hasQuiz &&
                false === conditionsMet &&
                ' (Requirement: Complete Quiz)'}
        </Button>
    );
};

export default MarkComplete;
