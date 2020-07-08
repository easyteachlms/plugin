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
(window.wpackioeasyTeachLMSquizJsonp=window.wpackioeasyTeachLMSquizJsonp||[]).push([[1],{12:function(t,e){t.exports=wp.i18n},18:function(t,e){t.exports=wp.blockEditor},23:function(t,e,r){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}r.d(e,"a",(function(){return n}))},26:function(t,e){t.exports=wp.blocks},29:function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));var n=r(23);function o(t,e){if(t){if("string"==typeof t)return Object(n.a)(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?Object(n.a)(t,e):void 0}}},32:function(t,e){t.exports=wp.data},320:function(t,e,r){r(67),t.exports=r(323)},323:function(t,e,r){"use strict";r.r(e);var n=r(41),o=r(26),c=r(12),a=r(32),i=r(9),s=r(18),u=function(t){var e=t.attributes,r=t.className,n=t.clientId,o=t.setAttributes,u=e.answer,l=e.isCorrect,p=Object(a.useSelect)((function(t){var e=t("core/block-editor").getBlockParentsByBlockName(n,"easyteachlms/question"),r=t("core/block-editor").getBlock(e),o=r.innerBlocks.filter((function(t){return t.clientId!==n}));return{answersType:r.attributes.answersType,otherAnswers:o}}),[l]),f=p.answersType,b=p.otherAnswers;return React.createElement("div",{className:r},React.createElement(s.BlockControls,null,React.createElement(i.Toolbar,{controls:[!0].map((function(){return{icon:"smiley",title:l?Object(c.__)("Correct Answer"):Object(c.__)("Incorrect Answer"),isActive:l,onClick:function(){"multiple"===f?o({isCorrect:!l}):(b.filter((function(t){return!0===t.attributes.isCorrect})).map((function(t){return t.clientId})).forEach((function(t,e){Object(a.dispatch)("core/block-editor").updateBlockAttributes(t,{isCorrect:!1})})),o({isCorrect:!l}))}}}))})),React.createElement(i.TextControl,{label:Object(c.__)("Answer"),value:u,onChange:function(t){return o({answer:t})},placeholder:"Answer Text Here"}))},l=function(t){var e=t.attributes;t.className,t.clientId,t.setAttributes,e.answer;return null},p=["easyteachlms/answer",{title:Object(c.__)("Answer"),description:"Block Desc.",category:"education",icon:"yes-alt",keywords:[Object(c.__)("Quiz")],supports:{html:!1,align:!1},parent:["easyteachlms/question"],attributes:{answer:{type:"string",default:""},isCorrect:{type:"boolean",default:!1}},edit:u,save:l}];o.registerBlockType.apply(void 0,Object(n.a)(p))},41:function(t,e,r){"use strict";r.d(e,"a",(function(){return c}));var n=r(23);var o=r(29);function c(t){return function(t){if(Array.isArray(t))return Object(n.a)(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(o.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},67:function(t,e,r){"use strict";var n="easyTeachLMSdist".replace(/[^a-zA-Z0-9_-]/g,"");r.p=window["__wpackIo".concat(n)]},9:function(t,e){t.exports=wp.components}},[[320,0]]]);
//# sourceMappingURL=answer-block-8a3ff904.js.map