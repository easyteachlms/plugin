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

const Tutorial = () => {
    const [open, openTutorial] = useState(false);
    return (
        <Card>
            <CardHeader>Need Help?</CardHeader>
            <CardBody>
                <p>
                    If you're looking for help click try our guided setup
                    tutorial.
                </p>
            </CardBody>
        </Card>
    );
};

export default Tutorial;
