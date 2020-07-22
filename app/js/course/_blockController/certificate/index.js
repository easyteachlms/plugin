import { Fragment, renderToString, useState, useEffect } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import { Button } from 'semantic-ui-react';
import html2pdf from 'html2pdf.js';

const Certificate = ({ children }) => {
    const { storeCertificate } = useDispatch('easyteachlms/course');
    console.log('store cert');
    storeCertificate(renderToString(children));
    return (
        <Fragment></Fragment>
    );
};

const DownloadCertificate = () => {
    const [loading, toggleLoading] = useState(false);

    const generate = () => {
        const certificate = select('easyteachlms/course').getCertificate();
        console.log('Download Cert');
        console.log(certificate);
        const opts = {
            margin:       0,
            filename:     'certificate.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().from(certificate, 'string').set(opts).outputPdf().then((e)=>{
            toggleLoading(false);
        }).save();
    }

    useEffect(
        () => {
            if ( true === loading ) {
            generate();
            }
        },
        [loading],
    );

    return <Button primary loading={loading} onClick={()=>toggleLoading(true)}>Download Certificate</Button>
}

export default Certificate;

export { DownloadCertificate, Certificate };