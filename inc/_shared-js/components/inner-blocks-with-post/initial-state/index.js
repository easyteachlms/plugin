/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { Card, CardBody, CardDivider } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import Create from './create';
import Search from './search';

// This component will contain a title and a post id. and state and inspector sidebar tools that let you define those manually as well (Should be another component)
// It will have a title field and a post selector search box that will filter to the post types you pass in as a prop.

const InitialState = ({
    postType,
    labels,
    setAttributes,
    className,
    clientId,
}) => {
    const { buttonLabel, headerLabel } = labels;
    const blockProps = useBlockProps({});
    return (
        <div {...blockProps}>
            <Card size="large" style={{marginTop: '1em'}}>
                {false !== postType && (
                    <Fragment>
                        <CardBody>
                            <Search
                                postType={postType}
                                clientId={clientId}
                                setAttributes={setAttributes}
                            />
                        </CardBody>
                        <CardDivider />
                    </Fragment>
                )}
                <CardBody>
                    <Create
                        headerLabel={headerLabel}
                        buttonLabel={buttonLabel}
                        setAttributes={setAttributes}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default InitialState;
