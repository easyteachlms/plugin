/**
 * WordPress Dependencies
 * 
 */
import apiFetch from '@wordpress/api-fetch';
import { Flex, FlexBlock, FlexItem } from '@wordpress/components';

const Toolbar = ({uuid, userId, courseId, type}) => {
    const MarkComplete = () => {
        return(
            <button onClick={()=>{
                console.log('Completed!', uuid);
                console.log({uuid, userId, courseId, type});
                apiFetch({
                    path: `/easyteachlms/v4/student/update-progress/`,
                    method: 'POST',
                    data: { 
                        action: 'lesson-content-complete',
                        courseId,
                        data: {
                            uuid,
                            status: 'complete'
                        },
                        userId,
                    },
                }).then( e => {
                    setTimeout(() => {
                        console.log('Result->', e);
                    }, 1000);
                });
            }}>
                Mark Complete
            </button>
        );
    }

    return(
        <Flex>
            <FlexItem>
                <span style={{
                    color: 'gray',
                    fontSize: '12px',
                    fontFamily: 'sans-serif'
                }}>
                    Powered by EasyTeachLMS
                </span>
            </FlexItem>
            <FlexBlock style={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <MarkComplete/>
            </FlexBlock>
        </Flex>
    );
}

export default Toolbar;