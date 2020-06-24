import { useDidMount } from '@daniakash/lifecycle-hooks';
import { withSelect, useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Button, Header, Menu } from 'semantic-ui-react';

const Topic = withSelect((select) => {
    return {
        active: select('easyteachlms/course').getActive(),
        courseId: select('easyteachlms/course').getCourseId(),
    };
})(
    ({
        parentTitle,
        title,
        active,
        uuid,
        courseId,
        hasQuiz,
        className,
        children,
    }) => {
        if (uuid !== active) {
            return <Fragment />;
        }

        const { updateProgress } = useDispatch('easyteachlms/course');

        const MarkComplete = () => {
            return (
                <Button
                    size="small"
                    color="green"
                    onClick={() => {
                        updateProgress(1, uuid, courseId);
                    }}
                >
                    Mark Completed
                </Button>
            );
        };

        const Toolbar = () => {
            return (
                <Menu style={{ fontSize: '14px' }}>
                    <Menu.Item>
                        <MarkComplete />
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
    },
);

export default Topic;
