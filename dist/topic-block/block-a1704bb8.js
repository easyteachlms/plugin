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
(window["wpackioeasyteachlmstopic-blockJsonp"]=window["wpackioeasyteachlmstopic-blockJsonp"]||[]).push([[0],[function(e,t){e.exports=wp.i18n},function(e,t){e.exports=wp.blockEditor},function(e,t){e.exports=wp.blocks},function(e,t){e.exports=wp.data},function(e,t){e.exports=lodash},function(e,t,r){r(6),e.exports=r(7)},function(e,t,r){"use strict";var n="easyteachlmsdist".replace(/[^a-zA-Z0-9_-]/g,"");r.p=window["__wpackIo".concat(n)]},function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}r.r(t);var c=r(2),a=r(0);var i,s=r(1),l=r(3),p=(r(4),function(e){e.attributes;var t=e.className,r=e.clientId,n=e.name,o=Object(l.useSelect)((function(e){return{blockType:(0,e("core/blocks").getBlockType)(n),hasInnerBlocks:e("core/block-editor").getBlocks(r).length>0}}),[r,n]);o.blockType,o.hasInnerBlocks,Object(l.useDispatch)("core/block-editor").replaceInnerBlocks;return React.createElement("div",{className:t},React.createElement("div",{className:"section-title"},React.createElement("strong",null,"Topic: "),"Topic Title Here"),React.createElement(s.InnerBlocks,null))}),u=function(e){e.attributes;var t=e.className;return React.createElement("div",{className:t},React.createElement(s.InnerBlocks.Content,null),React.createElement("button",null,"Mark Topic as Complete"))},y=["easyteachlms/topic",{title:Object(a.__)("Topic"),description:"Block Desc.",category:"layout",keywords:[Object(a.__)("Key 1"),Object(a.__)("Key 2"),Object(a.__)("Key 3")],supports:{html:!1,align:!0},attributes:{yourAttr:{type:"string"}},edit:p,save:u}];c.registerBlockType.apply(void 0,function(e){if(Array.isArray(e))return n(e)}(i=y)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(i)||o(i)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())}],[[5,1]]]);
//# sourceMappingURL=block-a1704bb8.js.map