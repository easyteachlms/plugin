import { useDispatch, useSelect } from '@wordpress/data';
import { Menu } from 'semantic-ui-react';

const Outline = ({ data }) => {
    const { setActive } = useDispatch('easyteachlms/course');
    const active = useSelect(
        (select) => select('easyteachlms/course').getActive(),
        [],
    );

    const Lessons = () => {
        const lessons = [];
        for (const uuid in data.structured) {
            const { title, outline } = data.structured[uuid];
            const topics = [];
            for (const uuid in outline) {
                const { title } = outline[uuid];
                topics.push(
                    <Menu.Item
                        onClick={() => setActive(uuid)}
                        active={active === uuid}
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
