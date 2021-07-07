/**
 * WordPress Dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useCourse } from './context';

const Dashboard = () => {
    const {courseDescription} = useCourse();
    return(
        <div>
            <RawHTML>{courseDescription}</RawHTML>
        </div>
    );
}

export default Dashboard;