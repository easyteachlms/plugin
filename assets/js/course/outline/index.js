/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useDispatch, useSelect } from '@wordpress/data';
import { Menu } from 'semantic-ui-react';

const Outline = ({ data }) => {
    const { setActive } = useDispatch('easyteachlms/course');
    const active = useSelect(
        (select) => select('easyteachlms/course').getActive(),
        [],
    );
    const { structured } = data.outline;

    const Lessons = () => {
        const lessons = [];
        for (const uuid in structured) {
            const { title, outline } = structured[uuid];
            const topics = [];
            for (const uuid in outline) {
                console.log('Outline');
                console.log(outline[uuid]);
                const { title } = outline[uuid];
                const isActive = active === uuid;
                topics.push(
                    <Menu.Item
                        onClick={() => setActive(uuid)}
                        active={isActive}
                    >
                        {title}
                    </Menu.Item>,
                );
            }
            lessons.push(
                <Menu.Item>
                    <Menu.Header>{title}</Menu.Header>
                    <Menu.Menu>{topics}</Menu.Menu>
                </Menu.Item>,
            );
        }
        return lessons;
    };

    return (
        <Menu vertical fluid>
            <Menu.Item
                onClick={() => {
                    console.log('go to dashboard');
                }}
            >
                Course Dashboard
            </Menu.Item>
            <Lessons />
        </Menu>
    );
};

export default Outline;
