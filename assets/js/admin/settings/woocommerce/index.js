import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
    Card,
    CardBody,
    CardDivider,
    CardFooter,
    CardHeader,
    CardMedia,
    ToggleControl,
} from '@wordpress/components';

const WooCommerceSettings = () => {
    const { openEnrollment } = easyTeachSettings;
    const [enabled, setPurchasability] = useState(!openEnrollment);

    const handler = (value) => {
        apiFetch({
            path: `/easyteachlms/v3/settings/update/?setting=openEnrollment`,
            method: 'POST',
            data: { value: !value },
        }).then((res) => {
            console.log(res);
            setPurchasability(value);
        });
    };

    return (
        <Card>
            <CardHeader>Enable Course Purchase</CardHeader>
            <CardBody>
                <p>
                    Enabling course purchases will turn off open enrollment for
                    your courses and require visitors purchase courses through
                    associated products.
                </p>
                <ToggleControl
                    label="Course Purchasing"
                    help={enabled ? 'Enabled' : 'Disabled'}
                    checked={enabled}
                    onChange={(val) => handler(val)}
                />
            </CardBody>
        </Card>
    );
};

export default WooCommerceSettings;
