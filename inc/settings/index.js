/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { Card, CardBody, TabPanel } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';
import BuddyPress from './buddypress';
import License from './license';
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
                            name: 'buddypress',
                            title: 'Groups (BuddyPress)',
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
                                    <License/>
                                </CardBody>
                            );
                        }
                        if ('buddypress' === tab.name) {
                            return (
                                <CardBody>
                                    <BuddyPress />
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
