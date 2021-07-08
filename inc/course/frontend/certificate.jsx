/**
 * WordPress Dependencies
 */
 import { Fragment, RawHTML } from '@wordpress/element';

 /**
  * Internal Dependencies
  */
 import { useCourse } from './context';

const Certificate = () => {
    const {userId, userCompleted, total} = useCourse();
    // If userId has met the requirements for courseId then display a button to print the certificate.
    // If user id has completed all the totals
    // Then present with the option to download/print a certificate on dashboard();
    if ( ! userCompleted >= total ) {
        return <Fragment/>
    }
    return(
        <div>
            <h4>Certificate</h4>
            <button>Download Certificate</button>
        </div>
    );
}

export default Certificate;