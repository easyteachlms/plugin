import { useDidMount } from '@daniakash/lifecycle-hooks';
import { withSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Button } from 'semantic-ui-react';

const Topic = withSelect((select) => {
    return {
        active: select('easyteachlms/course').getActive(),
    };
})(({ title, active, uuid, className, children }) => {
    if (uuid !== active) {
        return <Fragment />;
    }
    return (
        <div className={className} data-uuid={uuid}>
            {children}
            <Button size="medium" color="green">
                Mark Completed
            </Button>
        </div>
    );
});

export default Topic;
