/*!
 * 
 * easyteachlms
 * 
 * @author 
 * @version 0.1.0
 * @link UNLICENSED
 * @license UNLICENSED
 * 
 * Copyright (c) 2020 
 * 
 * This software is released under the UNLICENSED License
 * https://opensource.org/licenses/UNLICENSED
 * 
 * Compiled with the help of https://wpack.io
 * A zero setup Webpack Bundler Script for WordPress
 */
(window.wpackioeasyTeachLMSappJsonp=window.wpackioeasyTeachLMSappJsonp||[]).push([[0],{0:function(e,t){e.exports=React},132:function(e,t){e.exports=wp.domReady},152:function(e,t,c){c(153),e.exports=c(154)},154:function(e,t,c){"use strict";c.r(t);var n=c(331),l=c(16),a=c(132),o=c.n(a),r=c(133),s=c(330),u=Object(n.a)({loaded:!1})((function(e){e.loaded,e.setState;var t=e.children,c=(new r.Parser).parse(t)[1];console.log("Course HOC"),console.log(c);var n=function e(t,c){return l.Children.map(t,(function(t){if(!Object(l.isValidElement)(t))return React.createElement(l.RawHTML,null,t);t.props.children&&(t=Object(l.cloneElement)(t,{children:e(t.props.children,c)})),console.log("child recursive"),console.log(t);var n=t.props.className;return void 0===n?t:(console.log(n),console.log(n.includes("wp-block-easyteachlms-topic")),n.includes("wp-block-easyteachlms-topic")?React.createElement("div",null,React.createElement(l.Fragment,null,React.createElement("h3",null,"Topic:"),t,React.createElement(s.a,null,"Mark as Completed"))):n.includes("wp-block-embed-youtube")?React.createElement("div",null,React.createElement(l.Fragment,null,React.createElement("p",null,React.createElement("strong",null,"VIDEO HERE")),t,React.createElement("hr",null))):React.createElement(l.Fragment,null,t))}))}(c);return React.createElement("div",{className:"easyteach-lms-course"},n)}));o()((function(){document.querySelector(".wp-block-easyteachlms-course")&&document.querySelectorAll(".wp-block-easyteachlms-course").forEach((function(e){var t=e.innerHTML;Object(l.render)(React.createElement(u,null,t),e)}))}))},16:function(e,t){e.exports=wp.element},192:function(e,t){},39:function(e,t){e.exports=ReactDOM},86:function(e,t){e.exports=lodash}},[[152,1,2]]]);
//# sourceMappingURL=course-e362e100.js.map