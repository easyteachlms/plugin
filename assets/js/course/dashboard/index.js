import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Progress } from 'semantic-ui-react';

const Dashboard = ({ id }) => {
    const { isActive, progress, files } = useSelect((select) => {
        const active = select('easyteachlms/course').getActive();
        const data = select('easyteachlms/course').getData(id);
        const completed = select('easyteachlms/course').getCompleted();
        console.log('<Dashboard>');
        console.log(data);
        console.log(completed);
        return {
            data,
            isActive: 'dashboard' === active,
            progress: 100 * (completed / data.topics),
            files: select('easyteachlms/course').getFiles(),
        };
    }, []);
    if (true !== isActive) {
        return <Fragment />;
    }

    const Files = () => {
        console.info('<Files/>');
        const f = [];
        files.forEach((file) => {
            f.push(
                <li>
                    <a href={file.href} download>
                        {file.title}
                    </a>
                </li>,
            );
        });

        return (
            <Fragment>
                <h3>Files</h3>
                <p>
                    <i>Click to download files</i>
                </p>
                <ul>{f}</ul>
            </Fragment>
        );
    };

    return (
        <div>
            <h2>Hi, Seth Rubenstein</h2>
            <Progress
                percent={progress}
                color="teal"
                size="small"
                active
                autoSuccess
            >
                Course Progress
            </Progress>

            <p>Course Description Here...</p>

            <Files />
        </div>
    );
};

export default Dashboard;
