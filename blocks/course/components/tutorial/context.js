import { Fragment, createContext } from '@wordpress/element';
import Tour from 'reactour';

// Use state to toggle on off
const TutorialWalkthrough = ({ isOpen, children }) => {
    const steps = [
        {
          selector: '.components-button.block-list-appender__toggle.block-editor-button-block-appender',
          content: 'This is my first Step',
        },
        {
            selector: 'button.ui.teal.button',
            content: 'This is the NEXT step'
        }
        // ...
    ];
    return(
       <Fragment>
            <Tour
                steps={steps}
                isOpen={isOpen}
                onRequestClose={() => { setState({active: false}) }} 
            />
            {children}
       </Fragment>
    );
}

export default createContext({TutorialWalkthrough});