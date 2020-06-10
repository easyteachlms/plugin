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
(window.wpackioeasyTeachLMSwoocommerceJsonp=window.wpackioeasyTeachLMSwoocommerceJsonp||[]).push([[0],{1:function(e,t){e.exports=React},127:function(e,t){e.exports=wp.domReady},128:function(e,t){e.exports=wp.blocks},155:function(e,t,n){n(156),e.exports=n(278)},278:function(e,t,n){"use strict";n.r(t);var o=n(65),a=n(127),c=n.n(a),s=n(287),l=n(29),i=n(286),r=n(145),d=function(e){return"string"!=typeof e?"":e.charAt(0).toUpperCase()+e.slice(1)},u=(n(128),!1);document.getElementById("elms-attached-product")&&(u=document.getElementById("elms-attached-product").value);var p=Object(s.a)({loading:!0,selected:parseInt(u),posts:[]})((function(e){var t=e.postType,n=e.selected,a=(e.value,e.loading),c=e.posts,s=e.setState,u=d(t);return Object(r.a)((function(){(new wp.api.collections[u]).fetch({data:{status:["publish","draft"]}}).then((function(e){var t=[];e.map((function(e){t.push({key:e.id,value:e.id,text:e.title.rendered})})),s({posts:t,loading:!1})}))})),Object(l.useEffect)((function(){var e;null!==(e=document.getElementById("elms-attached-product")).value&&(e.value=n)}),[n]),React.createElement("div",{style:{padding:"1em",maxWidth:"400px"}},React.createElement("div",{style:{fontSize:"14px",fontFamily:"sans-serif",color:"gray",marginBottom:"1em"}},"Search for and select the course you would like to sell."),React.createElement(i.a,{placeholder:a?Object(o.__)("Loading ".concat(t,"...")):Object(o.__)("".concat(u,"'s")),fluid:!0,search:!0,selection:!0,loading:a,disabled:a,options:c,onChange:function(e,t){var n=t.options.find((function(e){return e.value===t.value})).value;s({selected:n})},value:parseInt(n),style:{fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",fontSize:"14px",border:"1px solid #7e8993"}}))}));c()((function(){document.getElementById("elms-product-field")&&Object(l.render)(React.createElement(p,{postType:"course",value:parseInt(u)}),document.getElementById("elms-product-field"))}))},29:function(e,t){e.exports=wp.element},46:function(e,t){e.exports=ReactDOM},65:function(e,t){e.exports=wp.i18n},89:function(e,t){e.exports=lodash}},[[155,1,2]]]);
//# sourceMappingURL=productEdit-72e4b352.js.map