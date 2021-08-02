import { Button, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const License = () => {
    const [licenseKey, setLicenseKey] = useState(false);
    
    const activateLicense = (key) => {
        apiFetch({
            path: `/easyteachlms/v4/settings/activate/`,
            method: 'POST',
            data: { 
                licenseKey: key
            },
        }).then( e => {
            setTimeout(() => {
                console.log('License Activated?', e);
            }, 1000);
        }).catch(e=>console.error(e));
    }

    return (
        <div>
            <p>Please enter your license and click activate in order to receive automattic updates.</p>
            <TextControl
                label="License Key"
                value={ false !== licenseKey ? licenseKey : null }
                onChange={ ( newKey ) => {
                    setLicenseKey(newKey)
                } }
            />
            <Button isPrimary onClick={()=>activateLicense(licenseKey)}>Activate</Button>
        </div>
    );
}

export default License;