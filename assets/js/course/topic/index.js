import { useDidMount } from '@daniakash/lifecycle-hooks';
import { withSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Button, Header, Menu } from 'semantic-ui-react';

const Topic = withSelect((select) => {
    return {
        active: select('easyteachlms/course').getActive(),
    };
})(({ parentTitle, title, active, uuid, hasQuiz, className, children }) => {
    if (uuid !== active) {
        return <Fragment />;
    }
    const MarkComplete = () => {
        return (
            <Button size="small" color="green">
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
});

export default Topic;
