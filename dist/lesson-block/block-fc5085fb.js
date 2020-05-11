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
(window["wpackioeasyteachlmslesson-blockJsonp"]=window["wpackioeasyteachlmslesson-blockJsonp"]||[]).push([[0],[function(e,t){e.exports=wp.i18n},function(e,t){e.exports=wp.blockEditor},function(e,t){e.exports=wp.blocks},function(e,t){e.exports=wp.data},function(e,t){e.exports=lodash},function(e,t,n){n(6),e.exports=n(8)},function(e,t,n){"use strict";var o="easyteachlmsdist".replace(/[^a-zA-Z0-9_-]/g,"");n.p=window["__wpackIo".concat(o)]},function(e,t,n){},function(e,t,n){"use strict";function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function r(e,t){if(e){if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}n.r(t);var c=n(2),s=n(0);var a,l=n(1),i=n(3),p=(n(4),["easyteachlms/topic"]),u=function(e){var t=e.attributes,n=e.className,o=e.clientId,r=e.name,c=(t.lessonID,t.title),s=Object(i.useSelect)((function(e){return{blockType:(0,e("core/blocks").getBlockType)(r),hasInnerBlocks:e("core/block-editor").getBlocks(o).length>0}}),[o,r]),a=(s.blockType,s.hasInnerBlocks,Object(i.useDispatch)("core/block-editor").replaceInnerBlocks,function(e){e.target.parentElement.classList.toggle("collapsed")});return React.createElement("div",{className:n},React.createElement("div",{className:"lesson-title",onClick:a},React.createElement("span",null,"Lesson:")," ",c),React.createElement("div",{className:"lesson-topics"},React.createElement(l.InnerBlocks,{allowedBlocks:p})))},m=function(e){e.attributes;var t=e.className;return React.createElement("div",{className:t},React.createElement(l.InnerBlocks.Content,null))},y=["easyteachlms/lesson",{title:Object(s.__)("Lesson"),description:"Block Desc.",category:"layout",keywords:[Object(s.__)("Key 1"),Object(s.__)("Key 2"),Object(s.__)("Key 3")],supports:{html:!1,align:!0},attributes:{lessonID:{type:"integer"},title:{type:"string",default:"Lesson Title Here"}},edit:u,save:m}];n(7);c.registerBlockType.apply(void 0,function(e){if(Array.isArray(e))return o(e)}(a=y)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(a)||r(a)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())}],[[5,1]]]);
//# sourceMappingURL=block-fc5085fb.js.map