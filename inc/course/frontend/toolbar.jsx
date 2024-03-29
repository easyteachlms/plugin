/**
 * WordPress Dependencies
 * 
 */
import apiFetch from '@wordpress/api-fetch';
import { Flex, FlexBlock, FlexItem } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useCourse } from './context';

const Toolbar = () => {
    const { currentlyActive, userId, courseId, userCompleted, setCompleted } = useCourse();
    
    const MarkComplete = () => {
        return(
            <button onClick={()=>{
                apiFetch({
                    path: `/easyteachlms/v4/student/update-progress/`,
                    method: 'POST',
                    data: { 
                        action: 'complete',
                        // cohort?
                        courseId,
                        uuid: currentlyActive.target,
                        data: {
                            status: 'complete'
                        },
                        userId,
                    },
                }).then( e => {
                    const tmp = userCompleted;
                    tmp.push(currentlyActive.target);
                    setCompleted([...tmp]);
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