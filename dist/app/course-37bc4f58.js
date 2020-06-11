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
(window.wpackioeasyTeachLMSappJsonp=window.wpackioeasyTeachLMSappJsonp||[]).push([[0],{0:function(e,t){e.exports=React},134:function(e,t){e.exports=wp.domReady},136:function(e,t){e.exports=wp.apiFetch},15:function(e,t){e.exports=wp.element},156:function(e,t,n){n(157),e.exports=n(338)},195:function(e,t){},338:function(e,t,n){"use strict";n.r(t);var c=n(345),a=n(15),l=n(134),r=n.n(l),o=n(135),u=n(136),i=n.n(u),s=n(56),p=n(344),m=n(137),d=n.n(m),E=function(e){e.id;var t=e.title,n=e.data;return Object(s.a)((function(){console.log("QUIZ"),console.log(n)})),React.createElement("div",null,React.createElement("h4",null,"Quiz Here"),React.createElement("h3",null,t),React.createElement(d.a,{quiz:n}))},f=function e(t,n,c){return a.Children.map(t,(function(t){if(!Object(a.isValidElement)(t))return React.createElement(a.RawHTML,null,t);t.props.children&&(t=Object(a.cloneElement)(t,{children:e(t.props.children,n,c)}));var l=t.props.className;if(void 0===l)return t;if(l.includes("wp-block-easyteachlms-topic"))return React.createElement("div",null,React.createElement(a.Fragment,null,React.createElement("h3",null,"Topic:"),t,React.createElement(p.a,{onClick:function(){console.log("COMPLETED")}},"Mark as Completed")));if(l.includes("wp-block-easyteachlms-quiz")){var r=t.props;return r.data=n.quizzes[t.props.id],React.createElement(E,r)}return l.includes("wp-block-embed-youtube")?React.createElement("div",null,React.createElement(a.Fragment,null,React.createElement("p",null,React.createElement("strong",null,"VIDEO HERE")),t,React.createElement("hr",null))):React.createElement(a.Fragment,null,t)}))},h=Object(c.a)({loaded:!1,data:!1,items:""})((function(e){e.loaded,e.data;var t=e.items,n=e.setState,c=e.children,a=(new o.Parser).parse(c);return Object(s.a)((function(){var e;e=a,i()({path:"/easyteachlms/v3/course/get/?course_id=193"}).then((function(t){n({loaded:!0,data:t,items:f(e,t)})}))})),React.createElement("div",{className:"easyteach-lms-course"},t)}));r()((function(){document.querySelector(".wp-block-easyteachlms-course")&&document.querySelectorAll(".wp-block-easyteachlms-course").forEach((function(e){var t=e.innerHTML;Object(a.render)(React.createElement(h,null,t),e)}))}))},40:function(e,t){e.exports=ReactDOM},89:function(e,t){e.exports=lodash}},[[156,1,2]]]);
//# sourceMappingURL=course-37bc4f58.js.map