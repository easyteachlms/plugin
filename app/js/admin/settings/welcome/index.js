import { Fragment } from '@wordpress/element';
import {
    Card,
    CardBody,
    CardHeader,
    CardMedia,
    CardFooter,
    CardDivider,
    ToggleControl,
    Button,
} from '@wordpress/components';

import { CourseCreationButton, WelcomeGraphic } from '@easyteachlms/shared';
import WooCommerceGraphic from './woocommerce-selling.gif';

const Tutorial = () => {
    return (
        <div style={{
            display: 'flex',
        }}>
            <div style={{width: '50%', paddingRight: '1em'}}>
                <Card>
                    <CardHeader>Getting Started With Course Creation</CardHeader>
                    <CardMedia>
                        <img
                            src={WelcomeGraphic}
                        />
                    </CardMedia>
                    <CardBody>
                        <p>
                            Need help creating a course? Click the button to
                            open the EasyTeach LMS course creation self
                            guided tutorial.
                        </p>
                    </CardBody>
                    <CardFooter>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <CourseCreationButton />
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div style={{width: '50%', paddingLeft: '1em'}}>
                <Card>
                    <CardHeader>Getting Started Selling Courses</CardHeader>
                    <CardBody>
                        <p>
                            To sell courses simply enable the{' '}
                            <strong>Course Purchasing</strong> option in the settings tab.
                        </p>
                        <img
                            src={WooCommerceGraphic}
                            style={{ maxWidth: '550px' }}
                        />
                        <p>
                            Match a course to a WooCommerce product and customers
                            who purchase that product will be enrolled in the
                            matched course.
                        </p>
                    </CardBody>
                </Card>        
            </div>           
        </div>
    );
};

export default Tutorial;
