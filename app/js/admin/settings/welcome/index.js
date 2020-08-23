import {
    Card,
    CardBody,
    CardHeader,
    CardMedia,
    CardDivider,
    CardFooter,
} from '@wordpress/components';
import { CourseCreationButton, WelcomeGraphic } from '@easyteachlms/shared';
import WooCommerceGraphic from './woocommerce-selling.gif';
import WooCommerceSettings from '../woocommerce';

const Tutorial = () => {
    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <div style={{ width: '50%', paddingRight: '1em' }}>
                <Card>
                    <CardHeader>
                        Getting Started With Course Creation
                    </CardHeader>
                    <CardMedia>
                        <img
                            src={WelcomeGraphic}
                            alt="Welcome tutorial graphic."
                        />
                    </CardMedia>
                    <CardBody>
                        <p>
                            Need help creating a course? Click the button to
                            open the EasyTeach LMS course creation self guided
                            tutorial.
                        </p>
                    </CardBody>
                    <CardFooter>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <CourseCreationButton />
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div style={{ width: '50%', paddingLeft: '1em' }}>
                <Card>
                    <CardHeader>Getting Started Selling Courses</CardHeader>
                    <CardBody>
                        <p>
                            To sell courses simply enable the{' '}
                            <strong>Course Purchasing</strong> option below.
                        </p>
                        <WooCommerceSettings />
                        <CardDivider />
                        <p>
                            Match a course to a WooCommerce product and
                            customers who purchase that product will be enrolled
                            in the matched course.
                        </p>
                        <img
                            src={WooCommerceGraphic}
                            style={{ maxWidth: '550px' }}
                            alt="WooCommerce tutorial graphic."
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Tutorial;
