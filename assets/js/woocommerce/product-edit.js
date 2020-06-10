import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { withState } from '@wordpress/compose';
import { Fragment, render, useEffect } from '@wordpress/element';
import { Dropdown } from 'semantic-ui-react';
import { useDidMount } from '@daniakash/lifecycle-hooks';
import { capitalize } from '@easyteachlms/utils';

// Load initial value from rendered DOM.
let value = false;
if (document.getElementById('elms-attached-product')) {
    value = document.getElementById('elms-attached-product').value;
}

const SearchForCourse = withState({
    loading: true,
    selected: parseInt(value),
    posts: [],
})(({ postType, selected, value, loading, posts, setState }) => {
    const type = capitalize(postType);

    const handleChange = (e, d) => {
        const { value } = d.options.find((o) => o.value === d.value);
        setState({ selected: value });
    };

    const setInputValue = () => {
        const input = document.getElementById('elms-attached-product');
        if (null !== input.value) {
            input.value = selected;
        }
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

    useEffect(() => {
        setInputValue();
    }, [selected]);

    return (
        <div
            style={{
                padding: '1em',
                maxWidth: '400px',
            }}
        >
            <div
                style={{
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    color: 'gray',
                    marginBottom: '1em',
                }}
            >
                Search for and select the course you would like to sell.
            </div>
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
                value={parseInt(selected)}
                style={{
                    fontFamily:
                        "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                    fontSize: '14px',
                    border: '1px solid #7e8993',
                }}
            />
        </div>
    );
});

domReady(function () {
    if (!document.getElementById('elms-product-field')) {
        return;
    }
    render(
        <SearchForCourse postType="course" value={parseInt(value)} />,
        document.getElementById('elms-product-field'),
    );
});
