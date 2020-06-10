import { __ } from '@wordpress/i18n';
import { withState } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { Dropdown, Form, Header } from 'semantic-ui-react';
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useDidMount } from '@daniakash/lifecycle-hooks';
import { capitalize, replaceContent } from '@easyteachlms/utils';

const SearchExisting = withState({
    loading: true,
    posts: [],
})(({ postType, loading, posts, setState, setAttributes, clientId }) => {
    const type = capitalize(postType);
    const { replaceInnerBlocks } = useDispatch('core/block-editor');

    const handleChange = (e, d) => {
        const { value, text } = d.options.find((o) => o.value === d.value);

        replaceContent(clientId, value, postType, replaceInnerBlocks).then(
            (post) => {
                setAttributes({
                    title: text,
                    id: value,
                    lastUpdated: post.modified_gmt,
                });
            },);
    };

    const loadPosts = () => {
        const postsCollection = new wp.api.collections[type]();
        postsCollection
            .fetch({ data: { status: ['publish', 'draft'] } })
            .then((posts) => {
                // "d" for Data
                const d = [];
                posts.map((post) => {
                    d.push({
                        key: post.id,
                        value: post.id,
                        text: post.title.rendered,
                    });
                });
                setState({ posts: d, loading: false });
            });
    };

    useDidMount(() => {
        loadPosts();
    });

    return (
        <Fragment>
            <Header
                as="h3"
                icon="search"
                content={__(`Search for existing ${postType}`)}
            />
            <Dropdown
                placeholder={
                    loading ? __(`Loading ${postType}...`) : __(`${type}'s`)
                }
                fluid
                search
                selection
                loading={loading}
                disabled={loading}
                options={posts}
                onChange={handleChange}
                style={{
                    fontFamily:
                        "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                    fontSize: '14px',
                }}
            />
        </Fragment>
    );
});

const CreateNew = withState({
    title: '',
})(({ title, postType, setState, setAttributes }) => {
    const handleChange = (e, { name, value }) => {
        setState({ title: value });
    };
    const handleCreation = () => {
        setAttributes({ title, id: 1 });
    };
    return (
        <Fragment>
            <Header
                as="h3"
                icon="add"
                content={__(`Start a new ${postType}`)}
            />
            <Form onSubmit={handleCreation}>
                <Form.Group>
                    <Form.Input
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={handleChange}
                    />
                    <Form.Button
                        color="blue"
                        icon="add"
                        content={__(`Create ${postType}`)}
                    />
                </Form.Group>
            </Form>
        </Fragment>
    );
});

// This component will contain a title and a post id. and state and inspector sidebar tools that let you define those manually as well (Should be another component)
// It will have a title field and a post selector search box that will filter to the post types you pass in as a prop.

// Should only be used when you have no inner block content or some other conditional like that

const InitialState = ({ postType, setAttributes, className, clientId }) => {
    // Select A Post
    // What the course title is, and what course is associated with it (for courses that should be easy... or not??)
    // What the lesson title is and what the lesson post its associated with...
    // What the topic title is and what the topic post is associated with.
    return (
        <div className={className}>
            <Card size="large">
                <CardHeader>
                    <SearchExisting
                        postType={postType}
                        clientId={clientId}
                        setAttributes={setAttributes}
                    />
                </CardHeader>
                {/* <CardDivider /> */}
                <CardBody>
                    <CreateNew
                        postType={postType}
                        setAttributes={setAttributes}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default InitialState;
