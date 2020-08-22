import domReady from '@wordpress/dom-ready';
import { render, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
    Card,
    CardBody,
    CardDivider,
    CardFooter,
    CardHeader,
    CardMedia,
    TabPanel
} from '@wordpress/components';

import './style.scss';

import WooCommerceSettings from './woocommerce';
import Welcome from './welcome';


const Settings = () => {
    return (
        <div id="easyteach-settings-wrapper">
            <h1>EasyTeach LMS Settings</h1>
            <Card>
                <TabPanel
                    activeClass="active-tab"
                    tabs={ [
                        {
                            name: 'welcome',
                            title: 'Welcome',
                            className: 'tab-one',
                        },
                        {
                            name: 'settings',
                            title: 'Settings',
                            className: 'tab-two',
                        },
                        {
                            name: 'license',
                            title: 'License Management',
                            className: 'tab-three',
                        },
                    ] }>
                    {
                        ( tab ) => {
                            if ( 'welcome' === tab.name ) {
                                return(<CardBody><Welcome/></CardBody>);
                            }
                            if ( 'settings' === tab.name ) {
                                return(<CardBody><WooCommerceSettings/></CardBody>);
                            }
                        }
                    }
                </TabPanel>
            </Card>
        </div>
    );
};

domReady(() => {
    const settingsTarget = document.getElementById('easyteachlms-settings');
    if (settingsTarget) {
        render(<Settings />, settingsTarget);
    }
});
