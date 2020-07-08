/*!
 * 
 * easyteachlms
 * 
 * @author 
 * @version 3.0.0
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
(window.wpackioeasyTeachLMSadminJsonp=window.wpackioeasyTeachLMSadminJsonp||[]).push([[1],[function(e,t){e.exports=wp.components},function(e,t){e.exports=wp.element},function(e,t){e.exports=wp.apiFetch},function(e,t){e.exports=wp.domReady},function(e,t,n){n(5),e.exports=n(7)},function(e,t,n){"use strict";var r="easyTeachLMSdist".replace(/[^a-zA-Z0-9_-]/g,"");n.p=window["__wpackIo".concat(r)]},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(3),a=n.n(r),o=n(1),c=n(2),l=n.n(c),u=n(0);n(6);function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,a=!1,o=void 0;try{for(var c,l=e[Symbol.iterator]();!(r=(c=l.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw o}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var d=function(){var e=easyTeachSettings.openEnrollment,t=s(Object(o.useState)(!e),2),n=t[0],r=t[1];return React.createElement(u.Card,null,React.createElement(u.CardHeader,null,"Enable Course Purchase"),React.createElement(u.CardBody,null,React.createElement("p",null,"Enabling course purchases will turn off open enrollment for your courses and require visitors purchase courses through associated products."),React.createElement(u.ToggleControl,{label:"Course Purchasing",help:n?"Enabled":"Disabled",checked:n,onChange:function(e){return t=e,void l()({path:"/easyteachlms/v3/settings/update/?setting=openEnrollment",method:"POST",data:{value:!t}}).then((function(e){console.log(e),r(t)}));var t}})))},p=function(){var e=s(Object(o.useState)(!1),2);e[0],e[1];return React.createElement(u.Card,null,React.createElement(u.CardHeader,null,"Need Help?"),React.createElement(u.CardBody,null,React.createElement("p",null,"If you're looking for help click try our guided setup tutorial.")))},m=function(){return React.createElement("div",null,React.createElement("h1",null,"EasyTeach LMS Settings"),React.createElement("div",{id:"settings-grid"},React.createElement("div",null,React.createElement(d,null)),React.createElement("div",null,React.createElement(p,null))))};a()((function(){var e=document.getElementById("easyteachlms-settings");e&&Object(o.render)(React.createElement(m,null),e)}))}],[[4,0]]]);
//# sourceMappingURL=settings-176a9cd8.js.map