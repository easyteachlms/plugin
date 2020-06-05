
import { withState } from '@wordpress/compose';
import { Fragment, useContext } from '@wordpress/element';
import { Button, Segment } from 'semantic-ui-react';

import tutorialContext from './context';

import illustration from './art/art2.png';

const Tutorial = withState( {
    active: false,
    disabled: false,
} )( ( { active, disabled, children, setState, setAttributes } ) => {
    // @TODO react hook for componentDidMount where we check the user api for if this user has perma-disabled the tutorial. We should offer a prompt.

    const { TutorialWalkthrough } = useContext(tutorialContext);

    const Prompt = () => {
        const Art = () => {
            return <div style={{textAlign:'center', marginBottom: '-2em'}}><img src={illustration} width='500px'/></div>
        }

		return(
			<Fragment>
                <Segment>
                    <Art/>
                    <h1>Hi! First time here?</h1>
                    <p><strong>TK COPY FOR TUTORIAL CALL TO ACTION</strong> Lorem ipsum is a pseudo-Latin text used in web design, 
                        typography, layout, and printing in place of English to emphasise 
                        design elements over content. It's also called placeholder (or filler) 
                        text. It's a convenient tool for mock-ups.</p>
                    
                    <Button primary onClick={() => { setState({active: true}) }}>Give me the tour</Button>

                    <Button secondary onClick={() => {
                        setState({disabled: !disabled});
                        setAttributes({tutorial: false});
                    }}>
                        Don't show Tutorial prompt again.
                    </Button>
                </Segment>
            </Fragment>
		);
	}
    // @TODO create context at this level that we can use for the child components so that we can pass the spotlight target component down in pseudo-state.
    return (
        <Fragment>
            <TutorialWalkthrough isOpen={active}>
            { true !== disabled && (
                <Fragment>
                    <Prompt/>
                    {children}
                </Fragment>
            )}
            {true === disabled && children}
            </TutorialWalkthrough>
        </Fragment>
    );
} );

export default Tutorial;