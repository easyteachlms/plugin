/**
 * External Dependencies
 */
import html2pdf from 'html2pdf.js';

/**
 * WordPress Dependencies
 */
import {
    Fragment,
    RawHTML,
    renderToString,
    useState,
    useEffect,
} from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useCourse } from './context';

const Certificate = () => {
    const {certificate, userCompleted, total} = useCourse();

    function generate() {
        const opts = {
            margin: 0,
            filename: 'certificate.pdf',
            image: { type: 'jpeg', quality: 1.00 },
            html2canvas: {
                scale: 1,
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
        };

        html2pdf()
            .from(certificate, 'string')
            .set(opts)
            .outputPdf()
            .then((e) => {})
            .save();
    };

    // If userId has met the requirements for courseId then display a button to print the certificate.
    // If user id has completed all the totals
    // Then present with the option to download/print a certificate on dashboard();
    if ( ! userCompleted >= total ) {
        return <Fragment/>
    }
    return(
        <div>
            <hr/>
            <h4>Certificate of Completion</h4>
            <p>Congratulations on the completion of this course! Click the button below to generate and download your certificate of completion.</p>
            <button onClick={()=>generate()}>Download Certificate</button>
        </div>
    );
}

export default Certificate;