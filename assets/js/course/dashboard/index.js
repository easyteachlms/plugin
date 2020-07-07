import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Progress, Icon } from 'semantic-ui-react';

const user = window.userData;

const Dashboard = ({ id }) => {
    const { isActive, progress, progressRatio, files, quizData } = useSelect(
        (select) => {
            const active = select('easyteachlms/course').getActive();
            const data = select('easyteachlms/course').getData(id);
            const completed = select('easyteachlms/course').getCompleted();
            const total = data.topics;
            const ratio = `${completed}/${total}`;
            console.log('<Dashboard>');
            console.log(data);
            return {
                data,
                isActive: 'dashboard' === active,
                progress: 100 * (completed / total),
                progressRatio: ratio,
                files: select('easyteachlms/course').getFiles(),
                quizData: select('easyteachlms/course').getQuizzes(),
            };
        },
        [],
    );
    if (true !== isActive) {
        return <Fragment />;
    }

    const { name } = user;

    const CourseProgress = () => {
        return (
            <Progress
                percent={progress}
                color="teal"
                size="small"
                active
                autoSuccess
            >
                {100 === progress
                    ? 'Course Completed!'
                    : `Course Progress ${progressRatio}`}
            </Progress>
        );
    };

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

    const Quizzes = () => {
        console.info('<Quizzes/>');
        const q = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const quiz in quizData) {
            if (quizData.hasOwnProperty(quiz)) {
                q.push(
                    <li>
                        <a>{quizData[quiz].quizTitle}</a>
                    </li>,
                );
            }
        }

        return (
            <Fragment>
                <h3>Quizzes</h3>
                <ul>{q}</ul>
            </Fragment>
        );
    };

    return (
        <div>
            <h2>Hi, {name}</h2>
            <CourseProgress />
            <p>Course Description Here...</p>
            <Quizzes />
            <Files />
        </div>
    );
};

export default Dashboard;
