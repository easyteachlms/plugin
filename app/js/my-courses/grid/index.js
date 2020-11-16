import { Fragment } from '@wordpress/element';
import { autop } from '@wordpress/autop';

console.log('My Courses');
console.log(window.myCoursesData);

const Card = ({ title, excerpt, url, progress }) => {
    console.log(progress);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '33%',
                border: '1px solid #eaeaea',
                padding: '1em',
                margin: '0.5em',
            }}
        >
            <div>
                <h3 style={{ margin: 0 }}>
                    <a href={url}>{title}</a>
                </h3>
            </div>
            <div style={{ paddingTop: '0.25em' }}>{excerpt}</div>
        </div>
    );
};

const Grid = ({}) => {
    const courses = [];
    window.myCoursesData.courses.forEach((course) => {
        console.log(course);
        courses.push(<Card {...course} />);
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}
        >
            {courses}
        </div>
    );
};

export default Grid;
