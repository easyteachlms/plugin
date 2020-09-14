import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { __experimentalGetSettings } from '@wordpress/date';
import { InspectorControls } from '@wordpress/block-editor';
import {
    DateTimePicker,
    Panel,
    PanelBody,
    PanelRow,
    TextControl,
} from '@wordpress/components';

import PostFetchToolbar from './post-fetch-toolbar';
import { SaveAsPostButton } from '../utils';

const ScheduleInFuture = () => {
    const settings = __experimentalGetSettings();
    const [date, setDate] = useState(new Date());

    // To know if the current timezone is a 12 hour time with look for an "a" in the time format.
    // We also make sure this a is not escaped by a "/".
    const is12HourTime = /a(?!\\)/i.test(
        settings.formats.time
            .toLowerCase() // Test only the lower case a
            .replace(/\\\\/g, '') // Replace "//" with empty strings
            .split('')
            .reverse()
            .join(''), // Reverse the string and test for "a" not followed by a slash
    );

    return (
        <Panel>
            <PanelBody title={__('Schedule For Future Release')} initialOpen>
                <PanelRow>
                    <DateTimePicker
                        currentDate={date}
                        onChange={(d) => setDate(d)}
                        is12Hour={is12HourTime}
                    />
                </PanelRow>
            </PanelBody>
        </Panel>
    );
};

const Controls = ({
    postId,
    postType,
    title,
    lastUpdated,
    clientId,
    setAttributes = false,
}) => {
    return (
        <Fragment>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__('Settings')} initialOpen>
                        <PanelRow>
                            <TextControl
                                label="Title"
                                value={title}
                                onChange={(t) => setAttributes({ title: t })}
                            />
                        </PanelRow>
                        {false !== postType && (
                            <Fragment>
                                <PanelRow>
                                    <TextControl
                                        label="ID"
                                        value={postId}
                                        disabled
                                    />
                                </PanelRow>
                                <PanelRow>
                                    <SaveAsPostButton
                                        title={title}
                                        postType={postType}
                                        postId={postId}
                                        clientId={clientId}
                                        setAttributes={setAttributes}
                                    />
                                </PanelRow>
                            </Fragment>
                        )}
                    </PanelBody>
                </Panel>
                {false !== postType && <ScheduleInFuture />}
            </InspectorControls>

            <PostFetchToolbar
                clientId={clientId}
                postType={postType}
                postId={postId}
                title={title}
                lastUpdated={lastUpdated}
                setAttributes={setAttributes}
            />
        </Fragment>
    );
};

export default Controls;
