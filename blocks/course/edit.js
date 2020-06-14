import { InnerBlocks } from '@wordpress/block-editor';
import { useContext, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useDidMount } from '@daniakash/lifecycle-hooks';
import { get, map } from 'lodash';

import './edit.scss';

import { Tutorial, tutorialContext } from './components';

const ALLOWED_BLOCKS = ['easyteachlms/lesson'];

const edit = ({ attributes, className, clientId, name, setAttributes }) => {
    const { tutorial, id } = attributes;
	
    // We get some information when the block's internal state changes.
    const { hasInnerBlocks, courseId } = useSelect(
        (select) => {
            return {
                hasInnerBlocks: 0 < select('core/block-editor').getBlocks(clientId).length,
                courseId: select('core/editor').getCurrentPostId(),
			};
        },
        [clientId, name],
    );

    const setCourseID = (courseId, id) => {
        if ( courseId !== id ) {
            setAttributes({id: courseId});
        }
    }

    useDidMount(() => {
        setCourseID(courseId, id);
    });

    // @TODOIf has innerblocks and some context provided tutorial finished is it set to true and or if the user has specified to never to be shown.
    if (hasInnerBlocks || false === tutorial) {
        return (
            <div className={className}>
                <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
            </div>
        );
    }

    // const { SpotlightTarget } = useContext(tutorialContext);

    return (
        <Tutorial setAttributes={setAttributes}>
            <div className={className}>
                <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
            </div>
        </Tutorial>
    );
};

export default edit;
