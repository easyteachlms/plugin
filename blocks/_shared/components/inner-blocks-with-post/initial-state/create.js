import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { v1 as uuidv1 } from 'uuid';

const Create = ({ headerLabel, buttonLabel, setAttributes }) => {
    const [title, setTitle] = useState(null);
    const handleChange = (val) => {
        setTitle(val);
    };
    const handleCreation = () => {
        setAttributes({ title, uuid: uuidv1() });
    };
    return (
        <Fragment>
            <div
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'black',
                    fontFamily: 'sans-serif',
                }}
            >
                {__(`${headerLabel}`)}
            </div>
            <form>
                <TextControl
                    value={title}
                    placeholder="Title"
                    name="title"
                    onChange={handleChange}
                />
                <Button isPrimary onClick={handleCreation}>
                    {__(`${buttonLabel}`)}
                </Button>
            </form>
        </Fragment>
    );
};

export default Create;
