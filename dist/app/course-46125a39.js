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
(window.wpackioeasyTeachLMSappJsonp=window.wpackioeasyTeachLMSappJsonp||[]).push([[0],{0:function(e,t){e.exports=React},123:function(e,t){e.exports=wp.domReady},125:function(e,t){e.exports=wp.apiFetch},145:function(e,t,n){n(146),e.exports=n(313)},15:function(e,t){e.exports=wp.element},171:function(e,t){},313:function(e,t,n){"use strict";n.r(t);var c=n(320),a=n(15),l=n(123),r=n.n(l),o=n(124),u=n.n(o),i=n(125),s=n.n(i),m=n(54),p=n(319),d=n(126),E=n.n(d),f=function(e){e.id;var t=e.title,n=e.data;return Object(m.a)((function(){console.log("QUIZ"),console.log(n)})),React.createElement("div",null,React.createElement("h4",null,"Quiz Here"),React.createElement("h3",null,t),React.createElement(E.a,{quiz:n}))},h=function e(t,n,c){return a.Children.map(t,(function(t){if(!Object(a.isValidElement)(t))return React.createElement(a.RawHTML,null,t);t.props.children&&(t=Object(a.cloneElement)(t,{children:e(t.props.children,n,c)}));var l=t.props.className;if(void 0===l)return t;if(l.includes("wp-block-easyteachlms-topic"))return React.createElement("div",null,React.createElement(a.Fragment,null,React.createElement("h3",null,"Topic:"),t,React.createElement(p.a,{onClick:function(){console.log("COMPLETED")}},"Mark as Completed")));if(l.includes("wp-block-easyteachlms-quiz")){var r=t.props;return r.data=n.quizzes[t.props.id],React.createElement(f,r)}return l.includes("wp-block-embed-youtube")?React.createElement("div",null,React.createElement(a.Fragment,null,React.createElement("p",null,React.createElement("strong",null,"VIDEO HERE")),t,React.createElement("hr",null))):React.createElement(a.Fragment,null,t)}))},R=Object(c.a)({loaded:!1,data:!1,items:""})((function(e){e.loaded,e.data;var t=e.items,n=e.setState,c=e.children,a=u()(c);return Object(m.a)((function(){var e;e=a,s()({path:"/easyteachlms/v3/course/get/?course_id=193"}).then((function(t){n({loaded:!0,data:t,items:h(e,t)})}))})),React.createElement("div",{className:"easyteach-lms-course"},t)}));r()((function(){document.querySelector(".wp-block-easyteachlms-course")&&document.querySelectorAll(".wp-block-easyteachlms-course").forEach((function(e){var t=e.innerHTML;Object(a.render)(React.createElement(R,null,t),e)}))}))},39:function(e,t){e.exports=ReactDOM},79:function(e,t){e.exports=lodash}},[[145,1,2]]]);
//# sourceMappingURL=course-46125a39.js.map