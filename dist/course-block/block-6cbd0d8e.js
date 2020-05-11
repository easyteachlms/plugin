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
(window["wpackioeasyteachlmscourse-blockJsonp"]=window["wpackioeasyteachlmscourse-blockJsonp"]||[]).push([[0],[function(e,t){e.exports=wp.i18n},function(e,t){e.exports=wp.blocks},function(e,t){e.exports=wp.blockEditor},function(e,t){e.exports=wp.data},function(e,t){e.exports=lodash},function(e,t,r){r(6),e.exports=r(7)},function(e,t,r){"use strict";var o="easyteachlmsdist".replace(/[^a-zA-Z0-9_-]/g,"");r.p=window["__wpackIo".concat(o)]},function(e,t,r){"use strict";function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,o=new Array(t);r<t;r++)o[r]=e[r];return o}function c(e,t){if(e){if("string"==typeof e)return o(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(e,t):void 0}}r.r(t);var n=r(1),a=r(0);var s,l=r(2),i=r(3),u=(r(4),["easyteachlms/lesson"]),p=function(e){e.attributes;var t=e.className,r=e.clientId,o=e.name,c=Object(i.useSelect)((function(e){return{blockType:(0,e("core/blocks").getBlockType)(o),hasInnerBlocks:e("core/block-editor").getBlocks(r).length>0}}),[r,o]);c.blockType,c.hasInnerBlocks,Object(i.useDispatch)("core/block-editor").replaceInnerBlocks;return React.createElement("div",{className:t},React.createElement("div",{className:"section-title"},React.createElement("strong",null,"Course: "),"Course Title Here"),React.createElement(l.InnerBlocks,{allowedBlocks:u}))},y=function(e){e.attributes;var t=e.className;return React.createElement("div",{className:t},React.createElement(l.InnerBlocks.Content,null))},m=["easyteachlms/course",{title:Object(a.__)("Course"),description:"Block Desc.",category:"layout",keywords:[Object(a.__)("Key 1"),Object(a.__)("Key 2"),Object(a.__)("Key 3")],supports:{html:!1,align:!0},attributes:{yourAttr:{type:"string"}},edit:p,save:y}];Object(n.registerBlockCollection)("easyteachlms",{title:"EasyTeach LMS"}),n.registerBlockType.apply(void 0,function(e){if(Array.isArray(e))return o(e)}(s=m)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(s)||c(s)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())}],[[5,1]]]);
//# sourceMappingURL=block-6cbd0d8e.js.map