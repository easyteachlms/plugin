/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { capitalize } from '@easyteachlms/utils';


// Load initial value from rendered DOM.
let value = false;
// if (document.getElementById('elms-attached-product')) {
//     value = document.getElementById('elms-attached-product').value;
// }

// const type = capitalize(postType);

// const handleChange = (e, d) => {
//     const { value } = d.options.find((o) => o.value === d.value);
//     setState({ selected: value });
// };

// const setInputValue = () => {
//     const input = document.getElementById('elms-attached-product');
//     if (null !== input.value) {
//         input.value = selected;
//     }
// };

// const loadPosts = () => {
//     const postsCollection = new wp.api.collections[type]();
//     postsCollection
//         .fetch({ data: { status: ['publish', 'draft'] } })
//         .then((posts) => {
//             // "d" for Data
//             const d = [];
//             posts.map((post) => {
//                 d.push({
//                     key: post.id,
//                     value: post.id,
//                     text: post.title.rendered,
//                 });
//             });
//             setState({ posts: d, loading: false });
//         });
// };

domReady(() => {
    if (document.querySelector('.js-easyteachlms-course-field')) {
        jQuery('.js-easyteachlms-course-field').select2();
    }
});
