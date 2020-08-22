/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useDispatch, useSelect, select } from '@wordpress/data';
import { Icon, Menu } from 'semantic-ui-react';

// const getBlockByUUID = (data, uuid) => {
//     return data.filter((obj) => {
//         return obj.uuid === uuid;
//     });
// };

// const getBlockIndexByUUID = (data, uuid) => {
//     return data.findIndex((obj) => obj.uuid === uuid);
// };

const Item = ({ title, uuid }) => {
    const { setActive } = useDispatch('easyteachlms/course');
    const { isComplete, isActive } = useSelect((select) => {
        const complete = select('easyteachlms/course').isComplete(uuid);
        const active = select('easyteachlms/course').getActive();
        return {
            isComplete: complete,
            isActive: active === uuid,
        };
    }, []);

    return (
        <Menu.Item onClick={() => setActive(uuid)} active={isActive}>
            {true === isComplete && <Icon name="check circle" />}
            {title}
        </Menu.Item>
    );
};

const Lessons = ({ id }) => {
    const { data, loaded } = useSelect((select) => {
        const data = select('easyteachlms/course').getData(id);
        let loaded = false;
        if (false !== data) {
            loaded = true;
        }
        return {
            data,
            loaded,
        };
    }, []);

    if (true !== loaded) {
        return;
    }

    const { outline } = data;
    const { structured } = outline;

    const lessons = [];
    for (const uuid in structured) {
        // Lesson
        const { title, outline } = structured[uuid];
        const contents = [];
        for (const uuid in outline) {
            // Lesson Content
            const { title } = outline[uuid];

            contents.push(<Item title={title} uuid={uuid} />);
        }
        lessons.push(
            <Menu.Item>
                <Menu.Header>{title}</Menu.Header>
                <Menu.Menu>{contents}</Menu.Menu>
            </Menu.Item>,
        );
    }

    return lessons;
};

const Outline = ({ id }) => {
    const { setActive } = useDispatch('easyteachlms/course');
    return (
        <Menu vertical fluid>
            <Menu.Item
                onClick={() => {
                    setActive('dashboard');
                }}
            >
                Course Dashboard
            </Menu.Item>
            <Lessons id={id} />
        </Menu>
    );
};

export default Outline;
