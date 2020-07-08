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
(window.wpackioeasyTeachLMSappJsonp=window.wpackioeasyTeachLMSappJsonp||[]).push([[2],{10:function(e,t){e.exports=wp.element},21:function(e,t){e.exports=wp.apiFetch},347:function(e,t,o){o(67),e.exports=o(348)},348:function(e,t,o){"use strict";o.r(t);var n=o(45),c=o.n(n),a=o(10),r=o(21),s=o.n(r),u=function(e){var t=e.userId,o=e.courseId;return React.createElement("a",{onClick:function(){s()({path:"/easyteachlms/v3/course/enroll/?userId=".concat(t,"&courseId=").concat(o),method:"POST",data:{enrolled:!0}}).then((function(e){console.log(e),setTimeout((function(){console.log("ENROLLED")}),1e3)}))}},"Enroll")};c()((function(){console.log("enroll button!"),document.querySelectorAll(".easyteachlms-enroll-button").forEach((function(e){var t=e.getAttribute("data-userId"),o=e.getAttribute("data-courseId");Object(a.render)(React.createElement(u,{userId:t,courseId:o}),e)}))}))},45:function(e,t){e.exports=wp.domReady},67:function(e,t,o){"use strict";var n="easyTeachLMSdist".replace(/[^a-zA-Z0-9_-]/g,"");o.p=window["__wpackIo".concat(n)]}},[[347,0]]]);
//# sourceMappingURL=enrollButton-d72c3e31.js.map