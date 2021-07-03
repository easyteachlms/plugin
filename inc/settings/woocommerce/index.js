import { Fragment, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { ToggleControl } from '@wordpress/components';

const { easyTeachSettings } = window;

const WooCommerceSettings = () => {
    const { openEnrollment } = easyTeachSettings;
    const [enabled, setPurchasability] = useState(!openEnrollment);

    const handler = (value) => {
        apiFetch({
            path: `/easyteachlms/v4/settings/update/?setting=openEnrollment`,
            method: 'POST',
            data: { value: !value },
        }).then((e) => {
            console.log('Purchasing Enabled?', e);
            setPurchasability(value);
        });
    };

    return (
        <Fragment>
            <p>
                Enabling course purchases will turn off open enrollment for your
                courses and require visitors purchase courses through associated
                products.
            </p>
            <ToggleControl
                label="Course Purchasing"
                help={enabled ? 'Enabled' : 'Disabled'}
                checked={enabled}
                onChange={(val) => handler(val)}
            />
        </Fragment>
    );
};

export default WooCommerceSettings;
