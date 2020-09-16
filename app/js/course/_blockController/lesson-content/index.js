import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Header, Menu } from 'semantic-ui-react';
import MarkComplete from './completion';

const LessonContent = ({ parentTitle, title, uuid, className, children }) => {
    const {
        isLocked,
        isComplete,
        isActive,
        conditionsMet,
        courseId,
    } = useSelect((select) => {
        return {
            isLocked: select('easyteachlms/course').isLocked(uuid),
            conditionsMet: select('easyteachlms/course').areConditionsMet(uuid),
            isComplete: select('easyteachlms/course').isComplete(uuid),
            isActive: select('easyteachlms/course').getActive() === uuid,
            courseId: select('easyteachlms/course').getCourseId(),
        };
    }, []);

    if (true !== isActive) {
        return <Fragment />;
    }

    const Toolbar = () => {
        return (
            <Menu style={{ fontSize: '14px' }}>
                <Menu.Item>
                    <MarkComplete
                        uuid={uuid}
                        courseId={courseId}
                        conditionsMet={conditionsMet}
                        isComplete={isComplete}
                    />
                </Menu.Item>

                <Menu.Item>Get Help</Menu.Item>
            </Menu>
        );
    };

    return (
        <Fragment>
            <Header as="h2" dividing>
                {title}
                {false !== parentTitle && (
                    <Header.Subheader>{parentTitle}</Header.Subheader>
                )}
            </Header>
            <div className={className} data-uuid={uuid}>
                {false === isLocked && (
                    <Fragment>
                        {children}
                        <Toolbar />
                    </Fragment>
                )}
                {false !== isLocked && (
                    <Fragment>
                        <p>This content is locked until: {isLocked}</p>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

export default LessonContent;
