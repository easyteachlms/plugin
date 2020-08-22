import { Fragment, useState, useEffect } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { SimpleAutocomplete } from '@opuscapita/react-autocompletes';
import { v1 as uuidv1 } from 'uuid';

const { api } = window.wp;

const capitalize = (s) => {
    if ('string' !== typeof s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const replaceContent = (clientId, postId, postType, replaceInnerBlocks) => {
    if (null === replaceInnerBlocks || undefined === replaceInnerBlocks) {
        return false;
    }
    if (
        undefined === clientId ||
        undefined === postId ||
        undefined === postType
    ) {
        return false;
    }

    const type = capitalize(postType);
    const post = new api.models[type]({ id: postId });
    console.log(post);

    return new Promise((resolve) => {
        post.fetch().then((p) => {
            const parsedBlocks = rawHandler({ HTML: p.content_raw });
            replaceInnerBlocks(clientId, parsedBlocks).then(() => {
                resolve(p);
            });
        });
    });
};

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
            <form>
                {false !== loaded && (
                    <SimpleAutocomplete
                        onSelect={(event, key) => {
                            const { value } = items.filter(
                                (i) => key === i.key,
                            )[0];
                            replaceContent(
                                clientId,
                                key,
                                postType,
                                replaceInnerBlocks,
                            ).then((post) => {
                                console.log('replaced content success');
                                console.log(post);
                                setAttributes({
                                    title: value,
                                    postId: key,
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
            </form>
        </Fragment>
    );
};

export default Search;
