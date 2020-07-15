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
} from '@wordpress/components';

import './style.scss';

import WooCommerceSettings from './woocommerce';
import Tutorial from './tutorial';

const Settings = () => {
    return (
        <div>
            <h1>EasyTeach LMS Settings</h1>
            <div id="settings-grid">
                <div>
                    <WooCommerceSettings />
                </div>
                <div>
                    <Tutorial />
                </div>
            </div>
        </div>
    );
};

domReady(() => {
    const settingsTarget = document.getElementById('easyteachlms-settings');
    if (settingsTarget) {
        render(<Settings />, settingsTarget);
    }
});
