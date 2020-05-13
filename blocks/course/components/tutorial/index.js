
import { withState } from '@wordpress/compose';
import { Fragment, useContext } from '@wordpress/element';
import Button from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';

import tutorialContext from './context';

const Tutorial = withState( {
    active: null,
    disabled: false,
} )( ( { active, disabled, children, setState } ) => {
    // @TODO react hook for componentDidMount where we check the user api for if this user has perma-disabled the tutorial. We should offer a prompt.

    const { Spotlight, SpotlightManager, SpotlightTransition } = useContext(tutorialContext);

    const start = () => setState({ active: 0 });

    const next = () => setState(() => ({ active: (active || 0) + 1 }));

    const prev = () => setState(() => ({ active: (active || 0) - 1 }));

    const finish = () => setState({ active: null });

    const renderActiveSpotlight = () => {
        const variants = [
            <Spotlight
                actions={[{ onClick: next, text: 'Next step'}]}
                dialogPlacement="top center"
                heading="Insert A Lesson"
                target="create-first-lesson"
                key="createLesson"
            >
                <p>The first step is creating a Lesson. Click the insert block button to insert a new lesson block where we will continue our tutorial.</p>
            </Spotlight>,
            <Spotlight
                actions={[
                    { onClick: next, text: 'Next' },
                    { onClick: prev, text: 'Prev' },
                ]}
                dialogPlacement="bottom center"
                heading="Yellow"
                target="yellow"
                key="yellow"
            >
                Test 2
            </Spotlight>,
            <Spotlight
                actions={[{ onClick: finish, text: 'Got it' }]}
                dialogPlacement="bottom right"
                heading="Red"
                target="red"
                key="red"
            >
                Test 3
            </Spotlight>,
        ];

        if (active == null) return null;

        return variants[active];
    };

    const Prompt = () => {
		const primaryAction = (
			<Button
				appearance="primary"
				onClick={start}
			>
				Give me the tour
			</Button>
		);
		
		const secondaryAction = (
			<Button onClick={next}>
				Secondary action
			</Button>
        );

        const tertiaryAction = (
			<Button appearance="subtle-link" onClick={() => setState({disabled: !disabled})}>
                Don't show Tutorial prompt again.
			</Button>
        );
		
		const emptyStateProps = {
			header: 'Hi! First time here?',
			description: `{TK COPY FOR TUTORIAL CALL TO ACTION} Lorem ipsum is a pseudo-Latin text used in web design, 
					typography, layout, and printing in place of English to emphasise 
					design elements over content. It's also called placeholder (or filler) 
					text. It's a convenient tool for mock-ups.`,
            primaryAction,
            secondaryAction,
            tertiaryAction
		};
		return(
			<div style={{border: '1px solid gray', background: 'white'}}>
                <EmptyState {...emptyStateProps} />
            </div>
		);
	}
    // @TODO create context at this level that we can use for the child components so that we can pass the spotlight target component down in pseudo-state.
    return (
        <Fragment>
            { true !== disabled && (
                <SpotlightManager>
                    <Prompt/>
        
                    <SpotlightTransition>
                        {renderActiveSpotlight()}
                    </SpotlightTransition>
        
                    {children}
                </SpotlightManager>
            )}
            {true === disabled && children}
        </Fragment>
    );
} );

export default Tutorial;