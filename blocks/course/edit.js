import { InnerBlocks } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useDidMount } from 'beautiful-react-hooks';

import './edit.scss';

import Welcome from './welcome';
import Controls from './controls';

const ALLOWED_BLOCKS = ['easyteachlms/lesson', 'easyteachlms/certificate'];

const edit = ({ attributes, className, clientId, name, setAttributes }) => {
    const { id } = attributes;

    // We get some information when the block's internal state changes.
    const { hasInnerBlocks, courseId } = useSelect(
        (select) => {
            return {
                hasInnerBlocks:
                    0 < select('core/block-editor').getBlocks(clientId).length,
                courseId: select('core/editor').getCurrentPostId(),
            };
        },
        [clientId, name],
    );

    const setCourseID = () => {
        if (courseId !== id) {
            setAttributes({ id: courseId });
        }
    };

    useDidMount(() => {
        setCourseID();
    });

    if (hasInnerBlocks) {
        return (
            <Fragment>
                <Controls setAttributes={setAttributes}/>
                <div className={className}>
                    <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} renderAppender={
                        ()=><InnerBlocks.ButtonBlockAppender />
                    } />
                </div>
            </Fragment>
        );
    }

    return (
        <Welcome setAttributes={setAttributes}>
            <div className={className}>
                <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} renderAppender={
                    ()=><InnerBlocks.ButtonBlockAppender />
                } />
            </div>
        </Welcome>
    );
};

export default edit;
