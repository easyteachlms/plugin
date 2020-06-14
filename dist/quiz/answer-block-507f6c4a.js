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
(window.wpackioeasyTeachLMSquizJsonp=window.wpackioeasyTeachLMSquizJsonp||[]).push([[1],{16:function(t,e){t.exports=wp.i18n},18:function(t,e){t.exports=wp.blockEditor},23:function(t,e,r){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}r.d(e,"a",(function(){return n}))},26:function(t,e){t.exports=wp.blocks},27:function(t,e){t.exports=wp.data},30:function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));var n=r(23);function o(t,e){if(t){if("string"==typeof t)return Object(n.a)(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?Object(n.a)(t,e):void 0}}},320:function(t,e,r){r(67),t.exports=r(323)},323:function(t,e,r){"use strict";r.r(e);var n=r(41),o=r(26),a=r(16),c=(r(27),r(9)),i=r(18),s=function(t){var e=t.attributes,r=t.className,n=(t.clientId,t.setAttributes),o=e.answer,a=e.isCorrect;return React.createElement("div",{className:r},React.createElement(i.BlockControls,null,React.createElement(c.Toolbar,{controls:[!0].map((function(t){return{icon:"smiley",title:a?"Correct Answer":"Incorrect Answer",isActive:a,onClick:function(){return n({isCorrect:!a})}}}))})),React.createElement(c.TextControl,{label:"Answer",value:o,onChange:function(t){return n({answer:t})},placeholder:"Answer Text Here"}))},u=function(t){var e=t.attributes;t.className,t.clientId,t.setAttributes,e.answer;return null},l=["easyteachlms/answer",{title:Object(a.__)("Answer"),description:"Block Desc.",category:"education",icon:"yes-alt",keywords:[Object(a.__)("Quiz")],supports:{html:!1,align:!1},parent:["easyteachlms/question"],attributes:{answer:{type:"string",default:""},isCorrect:{type:"boolean",default:!1}},edit:s,save:u}];o.registerBlockType.apply(void 0,Object(n.a)(l))},41:function(t,e,r){"use strict";r.d(e,"a",(function(){return a}));var n=r(23);var o=r(30);function a(t){return function(t){if(Array.isArray(t))return Object(n.a)(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(o.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},67:function(t,e,r){"use strict";var n="easyTeachLMSdist".replace(/[^a-zA-Z0-9_-]/g,"");r.p=window["__wpackIo".concat(n)]},9:function(t,e){t.exports=wp.components}},[[320,0]]]);
//# sourceMappingURL=answer-block-507f6c4a.js.map