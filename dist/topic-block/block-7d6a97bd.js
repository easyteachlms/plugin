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
(window["wpackioeasyteachlmstopic-blockJsonp"]=window["wpackioeasyteachlmstopic-blockJsonp"]||[]).push([[0],[function(t,e){t.exports=wp.i18n},function(t,e){t.exports=wp.blockEditor},function(t,e){t.exports=wp.blocks},function(t,e){t.exports=wp.data},function(t,e){t.exports=lodash},function(t,e,r){r(6),t.exports=r(7)},function(t,e,r){"use strict";var n="easyteachlmsdist".replace(/[^a-zA-Z0-9_-]/g,"");r.p=window["__wpackIo".concat(n)]},function(t,e,r){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function o(t,e){if(t){if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}r.r(e);var c=r(2),a=r(0);var s,i=r(1),l=r(3),p=(r(4),function(t){t.attributes;var e=t.className,r=t.clientId,n=t.name,o=Object(l.useSelect)((function(t){return{blockType:(0,t("core/blocks").getBlockType)(n),hasInnerBlocks:t("core/block-editor").getBlocks(r).length>0}}),[r,n]);o.blockType,o.hasInnerBlocks,Object(l.useDispatch)("core/block-editor").replaceInnerBlocks;return React.createElement("div",{className:e},React.createElement(i.InnerBlocks,null))}),u=function(t){t.attributes;var e=t.className;return React.createElement("div",{className:e},React.createElement(i.InnerBlocks.Content,null))},y=["easyteachlms/topic",{title:Object(a.__)("Topic"),description:"Block Desc.",category:"layout",keywords:[Object(a.__)("Key 1"),Object(a.__)("Key 2"),Object(a.__)("Key 3")],supports:{html:!1,align:!0},attributes:{yourAttr:{type:"string"}},edit:p,save:u}];c.registerBlockType.apply(void 0,function(t){if(Array.isArray(t))return n(t)}(s=y)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(s)||o(s)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())}],[[5,1]]]);
//# sourceMappingURL=block-7d6a97bd.js.map