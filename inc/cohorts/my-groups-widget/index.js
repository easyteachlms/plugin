/* eslint-disable camelcase */
/**
 * WordPress Dependencies:
 */
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/** Internal Dependencies */
import './style.scss';
import MyGroups from './my-groups';

domReady(() => {
    const attach = document.getElementById('my-groups-widget-render');
    if (attach) {
        render(<MyGroups />, attach);
    }
});
