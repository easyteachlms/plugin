import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { Card, CardBody, TabPanel } from '@wordpress/components';

import './style.scss';

import Welcome from './welcome';

const Settings = () => {
    return (
        <div id="easyteach-settings-wrapper">
            <h1>EasyTeach LMS Settings</h1>
            <Card>
                <TabPanel
                    initialTabName="welcome"
                    tabs={[
                        {
                            name: 'welcome',
                            title: 'Welcome',
                        },
                        {
                            name: 'license',
                            title: 'License Management and Updates',
                        },
                    ]}
                >
                    {(tab) => {
                        if ('license' === tab.name) {
                            return (
                                <CardBody>
                                    <p>
                                        Automatic upgrades through license
                                        activation coming at end of beta.
                                    </p>
                                </CardBody>
                            );
                        }
                        return (
                            <CardBody>
                                <Welcome />
                            </CardBody>
                        );
                    }}
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
