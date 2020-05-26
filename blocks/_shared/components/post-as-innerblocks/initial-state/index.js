import { withState } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { Dropdown, Form, Divider, Segment, Header } from 'semantic-ui-react';
import { __ } from '@wordpress/i18n';

const SearchExisting = ({postType, setAttributes}) => {
    // We need a promise that will set state and say loaded and also load the options from post values
    const options = [
        { key: 'a', value: 'a', text: 'Post A' },
        { key: 'b', value: 'b', text: 'Post B' },
        { key: 'c', value: 'c', text: 'Post C' },
        { key: 'd', value: 'd', text: 'Post D' },
        { key: 'e', value: 'e', text: 'Post E' },
        { key: 'f', value: 'f', text: 'Post F' },
        { key: 'g', value: 'g', text: 'Post G' },
        { key: 'h', value: 'h', text: 'Post H' },
        { key: 'i', value: 'i', text: 'Post I' },
        { key: 'j', value: 'j', text: 'Post J' },
        { key: 'l', value: 'l', text: 'Post L' },
        { key: 'k', value: 'k', text: 'Post K' },
    ];
 
    return (
        <Fragment>
            <Header as='h3' icon='search' content={__('Search for existing ' + postType)} />
            <Dropdown
                placeholder={__('Select ' + postType)}
                fluid
                search
                selection
                options={options}
                onChange={v => console.log(v)}
                style={{
                    fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                    fontSize: '14px',
                }}
            />
        </Fragment>
    );
}

const CreateNew = withState( {
    title: '',
} )( ( { title, postType, setState, setAttributes } ) => {
    const handleChange = (e, { name, value }) => {
        setState( { title: value } );
    }
    const handleCreation = () => {
        // let post = new wp.api.models[capitalize(postType)]( { title } );
        // post.save();
        // setAttributes( { title, id: post.id } );
        setAttributes({ title, id: 1 });
        // And also using the wp.api go create a lesson with this title, return the ID and then set the attribute as the ID.
    }
    return (
        <Fragment>
            <Header as='h3' icon='add' content={__('Start a new ' + postType)} />
            <Form onSubmit={handleCreation}>
              <Form.Group>
                <Form.Input
                  placeholder='Title'
                  name='title'
                  value={title}
                  onChange={handleChange}
                />
                <Form.Button color="teal" icon="add" content={__('Create ' + postType)} />
              </Form.Group>
            </Form>
        </Fragment>
    );
} );

// This component will contain a title and a post id. and state and inspector sidebar tools that let you define those manually as well (Should be another component)
// It will have a title field and a post selector search box that will filter to the post types you pass in as a prop.

// Should only be used when you have no inner block content or some other conditional like that

const InitialState = ({postType, setAttributes, className}) => {
    // Select A Post
    // What the course title is, and what course is associated with it (for courses that should be easy... or not??)
    // What the lesson title is and what the lesson post its associated with...
    // What the topic title is and what the topic post is associated with.
    return(
        <div className={className}>
            <Segment textAlign='center'>
                <SearchExisting postType={postType}/>
                <Divider horizontal>
                    <span  style={{
                        fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                        fontSize: '14px',
                    }}>Or</span>
                </Divider>
                <CreateNew postType={postType} setAttributes={setAttributes}/>
            </Segment>
        </div>
    );
}

export default InitialState;