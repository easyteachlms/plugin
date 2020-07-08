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
(window.wpackioeasyTeachLMSappJsonp=window.wpackioeasyTeachLMSappJsonp||[]).push([[1],{0:function(e,t){e.exports=React},10:function(e,t){e.exports=wp.element},142:function(e,t){e.exports=wp.url},16:function(e,t){e.exports=wp.data},166:function(e,t,n){n(67),e.exports=n(349)},167:function(e,t,n){},192:function(e,t){},21:function(e,t){e.exports=wp.apiFetch},349:function(e,t,n){"use strict";n.r(t);n(167);var a=n(45),c=n.n(a),r=n(141),o=n.n(r),u=n(16),l=n(10),i=n(142),s=n(62),d=n(359),m=n(360),f=function(e){var t=e.children;return React.createElement(l.Fragment,null,t)},p=n(357),h=n(358),E=n(36),g=n(356),v=n(21),R=n.n(v),y=window.userData.id,O=function(e){var t=e.uuid,n=e.userId,a=void 0===n?y:n,c=e.courseId,r=e.hasQuiz,o=e.conditionsMet,i=e.isComplete,s=Object(l.useState)(!1),d=Object(E.a)(s,2),m=d[0],f=d[1],p=Object(u.useDispatch)("easyteachlms/course").setComplete,h=!1;return(!0===r&&!0!==o||!0===i)&&(h=!0),React.createElement(g.a,{size:"small",color:i?"green":null,onClick:function(){f(!0),R()({path:"/easyteachlms/v3/student/update-progress/?userId=".concat(a,"&uuid=").concat(t,"&courseId=").concat(c),method:"POST",data:{completed:!0}}).then((function(){setTimeout((function(){f(!1),p(t)}),1e3)}))},loading:m,disabled:h},"Mark Completed",!0===r&&!1===o&&" (Requirement: Complete Quiz)")},w=function(e){var t=e.parentTitle,n=e.title,a=e.uuid,c=e.hasQuiz,r=e.className,o=e.children,i=Object(u.useSelect)((function(e){return{conditionsMet:e("easyteachlms/course").areConditionsMet(a),isComplete:e("easyteachlms/course").isComplete(a),isActive:e("easyteachlms/course").getActive()===a,courseId:e("easyteachlms/course").getCourseId()}}),[]),s=i.isComplete,d=i.isActive,m=i.conditionsMet,f=i.courseId;if(!0!==d)return React.createElement(l.Fragment,null);var E=function(){return React.createElement(p.a,{style:{fontSize:"14px"}},React.createElement(p.a.Item,null,React.createElement(O,{uuid:a,courseId:f,hasQuiz:c,conditionsMet:m,isComplete:s})),React.createElement(p.a.Item,null,"Get Help"))};return React.createElement(l.Fragment,null,React.createElement(h.a,{as:"h2",dividing:!0},n,!1!==t&&React.createElement(h.a.Subheader,null,t)),React.createElement("div",{className:r,"data-uuid":a},o,React.createElement(E,null)))},I=n(153),b=n.n(I),C=window.userData.id,z=function(e){var t=e.uuid,n=Object(u.useSelect)((function(e){var n=e("easyteachlms/course").getQuiz(t),a=!1;return!1!==n&&(a=!0),{data:n,loaded:a,courseId:e("easyteachlms/course").getCourseId()}}),[t]),a=n.data,c=n.loaded,r=n.courseId,o=Object(u.useDispatch)("easyteachlms/course"),l=o.setConditionsMet,i=o.setQuizScore;Object(s.a)((function(){console.log("QUIZ")}));return React.createElement("div",null,!1!==c&&React.createElement(b.a,{quiz:a,onComplete:function(e){console.log("onCompleteAction"),console.log(e);var n={score:e.correctPoints,total:e.totalPoints};R()({path:"/easyteachlms/v3/student/update-quiz-progress/?userId=".concat(C,"&uuid=").concat(t,"&courseId=").concat(r),method:"POST",data:n}).then((function(){l(a.parent),i(t,n)}))}}))},S=function e(t,n,a,c){return l.Children.map(t,(function(t){if(!Object(l.isValidElement)(t))return React.createElement(l.RawHTML,null,t);t.props.children&&(t=Object(l.cloneElement)(t,{children:e(t.props.children,n,c)}));var a=t.props["data-uuid"],r=n.outline.flat.filter((function(e){return e.uuid===a})),o=!1,u=!1;r.length&&(o=r[0].parentTitle,u=r[0].hasQuiz);var i=t.props.className;return void 0===i?t:i.includes("wp-block-easyteachlms-topic")?React.createElement(w,{title:t.props["data-title"],className:t.props.className,uuid:a,parentTitle:o,hasQuiz:u},t):i.includes("wp-block-easyteachlms-quiz")?React.createElement(z,{uuid:a}):i.includes("wp-block-embed-youtube")?React.createElement("div",null,React.createElement(l.Fragment,null,t,React.createElement("hr",null))):React.createElement(f,null,t)}))},D=n(354),T=window.userData,j=function(e){var t=e.id,n=Object(u.useSelect)((function(e){var n=e("easyteachlms/course").getActive(),a=e("easyteachlms/course").getData(t),c=e("easyteachlms/course").getCompleted(),r=a.outline.total,o="".concat(c,"/").concat(r);return console.log("<Dashboard>"),console.log(a),console.log(e("easyteachlms/course").getQuizzes()),{data:a,isActive:"dashboard"===n,progress:c/r*100,progressRatio:o,files:e("easyteachlms/course").getFiles(),quizData:e("easyteachlms/course").getQuizzes()}}),[]),a=n.isActive,c=n.progress,r=n.progressRatio,o=n.files,i=n.quizData,s=Object(u.useDispatch)("easyteachlms/course").setActive;if(!0!==a)return React.createElement(l.Fragment,null);var d=T.name,m=function(){return React.createElement(D.a,{percent:c,color:"teal",size:"small",active:!0,autoSuccess:!0},100===c?"Course Completed!":"Course Progress ".concat(r))},f=function(){console.info("<Files/>");var e=[];return o.forEach((function(t){e.push(React.createElement("li",null,React.createElement("a",{href:t.href,download:!0},t.title)))})),React.createElement(l.Fragment,null,React.createElement("h3",null,"Files"),React.createElement("p",null,React.createElement("i",null,"Click to download files")),React.createElement("ul",null,e))},p=function(){console.info("<Quizzes/>");var e=[];return i.forEach((function(t){e.push(React.createElement("li",null,React.createElement("a",{onClick:function(){s(t.parent)}},t.quizTitle)))})),React.createElement(l.Fragment,null,React.createElement("h3",null,"Quizzes"),React.createElement("ul",null,e))};return React.createElement("div",null,React.createElement("h2",null,"Hi, ",d),React.createElement(m,null),React.createElement("p",null,"Course Description Here..."),React.createElement(p,null),React.createElement(f,null))},P=n(38),A=function(e){var t=e.title,n=e.uuid,a=Object(u.useDispatch)("easyteachlms/course").setActive,c=Object(u.useSelect)((function(e){return{isComplete:e("easyteachlms/course").isComplete(n),isActive:e("easyteachlms/course").getActive()===n}}),[]),r=c.isComplete,o=c.isActive;return React.createElement(p.a.Item,{onClick:function(){return a(n)},active:o},!0===r&&React.createElement(P.a,{name:"check circle"}),t)},Q=function(e){var t=e.id,n=Object(u.useSelect)((function(e){var n=e("easyteachlms/course").getData(t),a=!1;return!1!==n&&(a=!0),{data:n,loaded:a}}),[]),a=n.data;if(!0===n.loaded){var c=a.outline.structured,r=[];for(var o in c){var l=c[o],i=l.title,s=l.outline,d=[];for(var m in s){var f=s[m].title;d.push(React.createElement(A,{title:f,uuid:m}))}r.push(React.createElement(p.a.Item,null,React.createElement(p.a.Header,null,i),React.createElement(p.a.Menu,null,d)))}return r}},M=function(e){var t=e.id,n=Object(u.useDispatch)("easyteachlms/course").setActive;return React.createElement(p.a,{vertical:!0,fluid:!0},React.createElement(p.a.Item,{onClick:function(){n("dashboard")}},"Course Dashboard"),React.createElement(Q,{id:t}))},F=function(e){var t=e.courseId,n=window.userData.id,a=Object(l.useState)(!1),c=Object(E.a)(a,2),r=c[0],o=c[1],i=Object(u.useDispatch)("easyteachlms/course").enroll,s=easyTeachSettings.openEnrollment;return React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"}},React.createElement("h1",null,"Not authorized"),React.createElement("p",null,"You are currently not enrolled in this course"),s&&React.createElement(g.a,{primary:!0,onClick:function(){o(!0),R()({path:"/easyteachlms/v3/course/enroll/?userId=".concat(n,"&courseId=").concat(t),method:"POST",data:{enrolled:!0}}).then((function(e){console.log(e),setTimeout((function(){o(!1),i(!0)}),1e3)}))},loading:r},"Enroll"))},_={fetchFromAPI:function(e){return{type:"FETCH_FROM_API",courseId:e}},initDataFromAPI:function(e){return{type:"INIT_DATA",data:e}},enroll:function(e){return{type:"ENROLL",status:e}},setActive:function(e){var t=window,n=t.history,a=t.location,c=a.protocol,r=a.pathname,o=a.host;if(n.pushState){var u="".concat(c,"//").concat(o).concat(r,"?uuid=").concat(e);n.pushState({path:u},"",u)}return{type:"SET_ACTIVE",uuid:e}},setComplete:function(e){return{type:"SET_COMPLETE",uuid:e}},setQuizScore:function(e,t){return{type:"SET_QUIZ_SCORE",uuid:e,score:t}},setConditionsMet:function(e){return{type:"SET_CONDITIONS_MET",uuid:e}}},x={FETCH_FROM_API:function(e){var t=window.userData.id;return console.log("FETCH_FROM_API"),console.log(t),R()({path:"/easyteachlms/v3/course/get/?courseId=".concat(e.courseId,"&userId=").concat(t)})}},q={getUserId:function(){return window.userData.id},getCourseId:function(e){return e.data.id},getActive:function(e){return e.active},getData:function(e,t){return console.log("selector::"),console.log("getData(".concat(t,")")),e.data},getQuiz:function(e,t){if(!e.data.hasOwnProperty("quizzes"))return!1;var n=e.data.outline,a=n.flat.findIndex((function(e){return e.hasQuiz&&e.hasOwnProperty("quiz")&&e.quiz.uuid===t}));return console.log("getQuiz"),console.log(a),!!n.flat[a].hasOwnProperty("quiz")&&n.flat[a].quiz},getQuizzes:function(e){if(!e.data.hasOwnProperty("outline")||!e.data.outline.hasOwnProperty("flat"))return!1;var t=e.data.outline,n=[];return console.log("getQuizzes"),t.flat.forEach((function(e){console.log(e),!0===e.hasQuiz&&n.push(e.quiz)})),n},getFiles:function(e){return!!e.data.hasOwnProperty("files")&&e.data.files},getCompleted:function(e){return!(!e.data.hasOwnProperty("outline")||!e.data.outline.hasOwnProperty("completed"))&&e.data.outline.completed},isComplete:function(e,t){if(!e.data.hasOwnProperty("outline")||!e.data.outline.hasOwnProperty("flat"))return!1;var n=e.data.outline.flat,a=n.findIndex((function(e){return e.uuid===t}));return n[a].completed},areConditionsMet:function(e,t){if(!e.data.hasOwnProperty("outline")||!e.data.outline.hasOwnProperty("flat"))return!1;var n=e.data.outline.flat,a=n.findIndex((function(e){return e.uuid===t}));return n[a].conditionsMet}},k=n(19);function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function H(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach((function(t){Object(k.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var L={active:!1,data:!1},U=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:L,t=arguments.length>1?arguments[1]:void 0,n=e.data,a=n.outline;switch(t.type){case"INIT_DATA":return H(H({},e),{},{data:t.data});case"SET_ACTIVE":return H(H({},e),{},{active:t.uuid});case"ENROLL":return n.enrolled=t.status,H(H({},e),{},{data:n});case"SET_QUIZ_SCORE":console.log("SET_QUIZ_SCORE");var c=a.flat.findIndex((function(e){return e.hasQuiz&&e.hasOwnProperty("quiz")&&e.quiz.uuid===t.uuid}));return console.log(c),console.log(n.outline.flat[c].quiz.userScore),console.log(t),console.log(t.scores),n.outline.flat[c].quiz.userScore=t.scores,console.log(n.outline.flat[c].quiz.userScore),H(H({},e),{},{data:n});case"SET_COMPLETE":return n.outline.flat[a.flat.findIndex((function(e){return e.uuid===t.uuid}))].completed=!0,n.outline.completed=n.outline.completed+1,H(H({},e),{},{data:n});case"SET_CONDITIONS_MET":return n.outline.flat[a.flat.findIndex((function(e){return e.uuid===t.uuid}))].conditionsMet=!0,H(H({},e),{},{data:n})}return e},Z=n(94),V=n.n(Z),J={getData:V.a.mark((function e(t){var n;return V.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("Initializing the first getData fetch into data store"),console.log("getData(".concat(t,")")),e.next=4,_.fetchFromAPI(t);case 4:return n=e.sent,console.log(n),e.abrupt("return",_.initDataFromAPI(n));case 7:case"end":return e.stop()}}),e)}))},G=(Object(u.registerStore)("easyteachlms/course",{reducer:U,actions:_,selectors:q,controls:x,resolvers:J}),function(e){var t=e.id,n=e.children,a=o()(n),c=Object(u.useDispatch)("easyteachlms/course").setActive,r=Object(u.useSelect)((function(e){var n=e("easyteachlms/course").getData(t);console.log(n);var a=!1;return!1!==n&&(a=!0),{data:n,loaded:a,isEnrolled:n.enrolled}}),[t]),f=r.data,p=r.loaded,h=r.isEnrolled;return Object(s.a)((function(){var e;e=Object(i.getQueryArg)(window.location.href,"uuid"),c(e||"dashboard")})),React.createElement(d.a,{loading:!p,style:{minHeight:"100px"}},!0===p&&!1===h&&React.createElement(F,{courseId:t}),!0===p&&!0===h&&React.createElement(m.a,{stackable:!0,divided:!0},React.createElement(m.a.Row,null,React.createElement(m.a.Column,{width:5},React.createElement(M,{id:t})),React.createElement(m.a.Column,{width:11},React.createElement(l.Fragment,null,React.createElement(j,{id:t}),S(a,f,"default"))))))});c()((function(){if(document.querySelector(".wp-block-easyteachlms-course")){document.querySelectorAll(".wp-block-easyteachlms-course").forEach((function(e){var t=parseInt(e.getAttribute("data-course-id")),n=e.innerHTML;Object(l.render)(React.createElement(G,{id:t,other:!1},n),e)}))}}))},45:function(e,t){e.exports=wp.domReady},47:function(e,t){e.exports=ReactDOM},94:function(e,t){e.exports=regeneratorRuntime}},[[166,0,3]]]);
//# sourceMappingURL=course-0b1542ab.js.map