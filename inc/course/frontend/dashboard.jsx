/**
 * WordPress Dependencies
 */
import { Fragment, RawHTML } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useCourse } from './context';
import Certificate from './certificate';

const Dashboard = () => {
    const {courseDescription, files} = useCourse();
    return(
        <div>
            {false !== courseDescription && (
                <div className="course-description">
                    <RawHTML>{courseDescription}</RawHTML>
                </div>
            )}
            <Certificate/>
            {false !== files && 0 !== files.length && (
                <Fragment>
                    <h4>Downloadbale Files</h4>
                    <ul>
                        {files.map(f => {
                            return <li><a href={f.href} download>{f.title}</a></li>
                        })}
                    </ul>
                </Fragment>
            )}
        </div>
    );
}

export default Dashboard;