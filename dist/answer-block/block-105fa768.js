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
(window["wpackioeasyTeachLMSanswer-blockJsonp"]=window["wpackioeasyTeachLMSanswer-blockJsonp"]||[]).push([[0],[function(e,t){e.exports=wp.i18n},function(e,t){e.exports=wp.components},function(e,t){e.exports=wp.blocks},function(e,t){e.exports=wp.blockEditor},function(e,t,r){r(5),e.exports=r(7)},function(e,t,r){"use strict";var n="easyTeachLMSdist".replace(/[^a-zA-Z0-9_-]/g,"");r.p=window["__wpackIo".concat(n)]},function(e,t){e.exports=wp.data},function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}r.r(t);var o,a=r(2),c=r(0),i=(r(6),r(1)),s=r(3),l=function(e){var t=e.attributes,r=e.className,n=(e.clientId,e.setAttributes),o=t.answer,a=t.isCorrect;return React.createElement("div",{className:r},React.createElement(s.BlockControls,null,React.createElement(i.Toolbar,{controls:[!0].map((function(e){return{icon:"smiley",title:a?"Correct Answer":"Incorrect Answer",isActive:a,onClick:function(){return n({isCorrect:!a})}}}))})),React.createElement(i.TextControl,{label:"Answer",value:o,onChange:function(e){return n({answer:e})},placeholder:"Answer Text Here"}))},u=["easyteachlms/answer",{title:Object(c.__)("Answer"),description:"Block Desc.",category:"education",icon:"yes-alt",keywords:[Object(c.__)("Quiz")],supports:{html:!1,align:!1},parent:["easyteachlms/question"],attributes:{answer:{type:"string",default:""},isCorrect:{type:"boolean",default:!1}},edit:l,save:null}];a.registerBlockType.apply(void 0,function(e){if(Array.isArray(e))return n(e)}(o=u)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(o)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(o)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())}],[[4,1]]]);
//# sourceMappingURL=block-105fa768.js.map