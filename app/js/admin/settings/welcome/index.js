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
                        <h3>SELLING & MARKETING YOUR COURSES</h3>
                        <p>
                            EasyTeach is designed to work with WooCommerce - a
                            FREE & ROBUST e-commerce plugin.
                        </p>
                        <ol>
                            <li>
                                Install and Set Up WooCommerce on your site. For
                                a step-by-step guide to setting getting started
                                with WooCommerce,{' '}
                                <a
                                    href="https://woocommerce.com/posts/how-to-set-up-a-new-woocommerce-store/"
                                    target="_blank"
                                >
                                    CLICK HERE
                                </a>
                                .
                            </li>
                            <li>
                                Create your course in EasyTeach LMS. To access
                                our tutorial at any time,{' '}
                                <CourseCreationButton />
                            </li>
                            <li>
                                Once you have completed Steps 1 and 2, navigate
                                to the EasyTeach LMS Settings & Help page found
                                HERE OR navigate to the WordPress Dashboard,
                                click on EasyTeach LMS from the black menu on
                                the left-hand side, and then select Settings &
                                Help.
                                <ul>
                                    <li>
                                        From the Settings & Help page, enable
                                        the Course Purchasing Option on the
                                        right-hand side of the screen.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <p>
                                    Now you are ready to add your course to any
                                    product! Navigate to the WooCommerce Add
                                    Product page found HERE OR navigate to the
                                    WordPress Dashboard, click on PRODUCTS from
                                    the black menu on the left-hand side, and
                                    then select ADD NEW
                                </p>
                                <img
                                    src={WooCommerceGraphic}
                                    style={{ maxWidth: '550px' }}
                                    alt="WooCommerce tutorial graphic."
                                />
                                <ul>
                                    <li>
                                        For a complete guide to setting up
                                        products on WooCommerce,{' '}
                                        <a
                                            href="https://docs.woocommerce.com/document/managing-products/"
                                            target="_blank"
                                        >
                                            CLICK HERE
                                        </a>
                                        .
                                    </li>
                                    <li>
                                        To add your course to any product
                                        <ul>
                                            <li>
                                                Select Product Data: SIMPLE
                                                PRODUCT
                                            </li>
                                            <li>
                                                Check the box next to “Virtual”
                                                and EasyTeach LMS will now be an
                                                option in the PRODUCT DATA
                                                section.
                                            </li>
                                            <li>
                                                Click on the EasyTeach LMS
                                                button and search for your
                                                course in the search field.
                                                Select the course you want to
                                                attach to the product.
                                            </li>
                                            <li>
                                                Be sure to define the Name,
                                                Price, and any other field you
                                                might like (for a full how-to
                                                <a
                                                    href="https://docs.woocommerce.com/document/managing-products/"
                                                    target="_blank"
                                                >
                                                    CLICK HERE
                                                </a>
                                                ). Once you are done, click the
                                                Publish button. Your course will
                                                now be available for purchase on
                                                your site’s WooCommerce SHOP
                                                page.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ol>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Tutorial;
