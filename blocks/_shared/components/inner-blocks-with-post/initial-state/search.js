import { Fragment, useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { SimpleAutocomplete } from '@opuscapita/react-autocompletes';
import { v1 as uuidv1 } from 'uuid';
import { capitalize, replaceContent } from '../utils';

const { api } = window.wp;

const Search = ({ postType, setAttributes, clientId }) => {
    const { replaceInnerBlocks } = useDispatch('core/block-editor');
    const [items, setItems] = useState([]);
    const [loaded, toggleLoaded] = useState(false);
    const type = capitalize(postType);

    const loadPosts = () => {
        if (undefined !== api) {
            const postsCollection = new api.collections[type]();
            postsCollection
                .fetch({ data: { status: ['publish', 'draft'] } })
                .then((p) => {
                    const d = [];
                    p.map((post) => {
                        d.push({
                            key: post.id,
                            value: post.title.rendered,
                        });
                    });
                    setItems(items.concat(d));
                    toggleLoaded(true);
                });
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

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
                {__(`Search for existing ${postType}`)}
            </div>
            {false !== loaded && (
                <SimpleAutocomplete
                    onSelect={(event, key) => {
                        replaceContent(
                            clientId,
                            key,
                            postType,
                            replaceInnerBlocks,
                        ).then((post) => {
                            setAttributes({
                                title: post.title.rendered,
                                postId: post.id,
                                lastUpdated: post.modified_gmt,
                                uuid: uuidv1(),
                            });
                        });
                    }}
                    placeholder="Start typing"
                    origin="bottom"
                    inputElement={(props) => {
                        return (
                            <input
                                className="components-text-control__input"
                                {...props}
                            />
                        );
                    }}
                    items={items}
                />
            )}
        </Fragment>
    );
};

export default Search;
