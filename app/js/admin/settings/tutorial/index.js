import { Fragment } from '@wordpress/element';
import {
    Card,
    CardBody,
    CardDivider,
    CardFooter,
    CardHeader,
    CardMedia,
    ToggleControl,
    Button,
} from '@wordpress/components';

import { CourseCreationButton, WelcomeGraphic } from '@easyteachlms/shared';
import WooCommerceGraphic from './woocommerce-selling.gif';

const Tutorial = () => {
    return (
        <Fragment>
            <Card>
                <CardHeader>Need Help?</CardHeader>
                <CardBody>
                    <h3>Getting Started With Course Creation</h3>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div>
                            <img
                                src={WelcomeGraphic}
                                style={{ maxWidth: '200px' }}
                            />
                        </div>
                        <div>
                            <p>
                                Need help creating a course? Click the button to
                                open the EasyTeach LMS course creation self
                                guided tutorial.
                            </p>
                            <CourseCreationButton />
                        </div>
                    </div>
                    <CardDivider />
                    <h3>Selling Courses</h3>
                    <p>
                        To sell courses simply enable the{' '}
                        <strong>Course Purchasing</strong> option to your left.
                    </p>
                    <p>
                        Match a course to a WooCommerce product and customers
                        who purchase that product will be enrolled in the
                        matched course.
                    </p>
                    <img
                        src={WooCommerceGraphic}
                        style={{ maxWidth: '100%' }}
                    />
                </CardBody>
            </Card>
        </Fragment>
    );
};

export default Tutorial;
