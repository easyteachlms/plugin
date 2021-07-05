/**
 * WordPress Dependencies
 */
import { RawHTML } from '@wordpress/element';

const Dashboard = ({courseInfo}) => {
    const { description, files, title } = courseInfo;
    return(
        <div>
            <RawHTML>{description}</RawHTML>
        </div>
    );
}

export default Dashboard;