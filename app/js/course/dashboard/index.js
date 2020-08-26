import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, RawHTML } from '@wordpress/element';
import { Progress, Icon } from 'semantic-ui-react';
import { autop } from '@wordpress/autop';

import { DownloadCertificate } from '../_blockController/certificate';

const user = window.userData;

const Dashboard = ({ id }) => {
    const {
        isActive,
        progress,
        progressRatio,
        files,
        quizData,
        description,
    } = useSelect((select) => {
        const active = select('easyteachlms/course').getActive();
        const data = select('easyteachlms/course').getData(id);
        const completed = select('easyteachlms/course').getCompleted();
        const { total } = data.outline;
        const ratio = `${completed}/${total}`;
        console.log('<Dashboard>');
        console.log(data);
        console.log(select('easyteachlms/course').getQuizzes());
        return {
            data,
            isActive: 'dashboard' === active,
            progress: 100 * (completed / total),
            progressRatio: ratio,
            description: data.description,
            files: select('easyteachlms/course').getFiles(),
            quizData: select('easyteachlms/course').getQuizzes(),
        };
    }, []);

    const { setActive } = useDispatch('easyteachlms/course');

    if (true !== isActive) {
        return <Fragment />;
    }

    const { name } = user;

    const CourseProgress = () => {
        return (
            <Fragment>
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
                {100 === progress && <DownloadCertificate />}
            </Fragment>
        );
    };

    const CourseDescription = () => {
        if (!description) {
            return <Fragment />;
        }
        return (
            <div>
                <RawHTML>{autop(description)}</RawHTML>
            </div>
        );
    };

    const Files = () => {
        console.info('<Files/>');
        if (0 == files.length) {
            return <Fragment />;
        }
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
        if (0 == quizData.length) {
            return <Fragment />;
        }
        const q = [];

        quizData.forEach((quiz) => {
            q.push(
                <li>
                    <a
                        onClick={() => {
                            setActive(quiz.uuid);
                        }}
                    >
                        {quiz.title}
                    </a>
                </li>,
            );
        });

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
            <CourseDescription />
            <Quizzes />
            <Files />
        </div>
    );
};

export default Dashboard;
