import { useEffect, useState } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';
import { escapeHTML } from '@wordpress/escape-html';
const { api } = window.wp;

const PostSelectField = ({ value, postType = 'Posts' }) => {
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [availableTokens, setAvailableTokens] = useState([]);

    const searchPosts = (input) => {
        const timeout = setTimeout(() => {
            const collection = new api.collections[postType]();
            collection
                .fetch()
                .then((posts) => {
                    console.log('posts?', posts);

                    return posts.filter((post) => {
                        console.log(post.title.rendered);
                        const title = escapeHTML(post.title.rendered);
                        console.log(title);
                        console.log(title.toLowerCase());
                        return title.toLowerCase().includes(input.toLowerCase());
                    });
                })
                .then((available) => {
                    setAvailableTokens(available);
                });
        }, 1000);

        return () => clearTimeout(timeout);
    };

    return (
        <FormTokenField
            className="wp-post-select-token-field"
            value={value}
            suggestions={availableTokens}
            onChange={(tokens) => setSelectedTokens(tokens)}
            onInputChange={searchPosts}
            label="Search for post(s)"
        />
    );
};

export default PostSelectField;
