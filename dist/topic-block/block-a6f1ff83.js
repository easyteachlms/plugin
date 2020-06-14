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
(window["wpackioeasyTeachLMStopic-blockJsonp"]=window["wpackioeasyTeachLMStopic-blockJsonp"]||[]).push([[0],{0:function(e,t){e.exports=React},114:function(e,t){e.exports=lodash},18:function(e,t){e.exports=wp.i18n},193:function(e,t,n){n(194),e.exports=n(319)},20:function(e,t){e.exports=wp.components},21:function(e,t){e.exports=wp.element},318:function(e,t,n){},319:function(e,t,n){"use strict";n.r(t);var a=n(182),c=n(51),l=n(18),i=n(163),o=n(57),r=n(21),s=n(5),d=n.n(s),u=n(330),p=n(333),m=function(e){var t=e.title,n=e.postType,a=e.className,c=e.children,i=e.defaultOpen,s=void 0===i||i,m=Object(r.useState)(s),f=Object(o.a)(m,2),b=f[0],R=f[1],E=b?"down":"right";return React.createElement("div",{className:d()(a,"lmsui-collapsible")},React.createElement("div",{className:"collapsible-title"},React.createElement(u.a,{as:"h4",icon:"caret ".concat(E),content:Object(l.__)("".concat(n.toUpperCase(),":  ").concat(t)),onClick:function(){R(!b)}})),React.createElement(p.a,{visible:b,animation:"fade down",duration:500},React.createElement("div",{className:"collapsible-content"},c)))},f=n(69),b=n(332),R=n(329),E=n(328),v=n(20),h=n(61),y=n(91),g=function(e){return"string"!=typeof e?"":e.charAt(0).toUpperCase()+e.slice(1)},w=function(e,t,n,a){if(null==a)return!1;if(void 0===e||void 0===t||void 0===n)return!1;var l=g(n),i=new wp.api.models[l]({id:t});return new Promise((function(t){i.fetch().then((function(n){var l=Object(c.rawHandler)({HTML:n.content_raw});a(e,l).then((function(){t(n)}))}))}))},O=Object(b.a)({loading:!0,posts:[]})((function(e){var t=e.postType,n=e.loading,a=e.posts,c=e.setState,i=e.setAttributes,o=e.clientId,s=g(t),d=Object(h.useDispatch)("core/block-editor").replaceInnerBlocks;return Object(y.a)((function(){(new wp.api.collections[s]).fetch({data:{status:["publish","draft"]}}).then((function(e){var t=[];e.map((function(e){t.push({key:e.id,value:e.id,text:e.title.rendered})})),c({posts:t,loading:!1})}))})),React.createElement(r.Fragment,null,React.createElement(u.a,{as:"h3",icon:"search",content:Object(l.__)("Search for existing ".concat(t))}),React.createElement(R.a,{placeholder:n?Object(l.__)("Loading ".concat(t,"...")):Object(l.__)("".concat(s,"'s")),fluid:!0,search:!0,selection:!0,loading:n,disabled:n,options:a,onChange:function(e,n){var a=n.options.find((function(e){return e.value===n.value})),c=a.value,l=a.text;w(o,c,t,d).then((function(e){i({title:l,id:c,lastUpdated:e.modified_gmt})}))},style:{fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",fontSize:"14px"}}))})),k=Object(b.a)({title:""})((function(e){var t=e.title,n=e.postType,a=e.setState,c=e.setAttributes;return React.createElement(r.Fragment,null,React.createElement(u.a,{as:"h3",icon:"add",content:Object(l.__)("Start a new ".concat(n))}),React.createElement(E.a,{onSubmit:function(){c({title:t,id:1})}},React.createElement(E.a.Group,null,React.createElement(E.a.Input,{placeholder:"Title",name:"title",value:t,onChange:function(e,t){var n=t.value;a({title:n})}}),React.createElement(E.a.Button,{color:"blue",icon:"add",content:Object(l.__)("Create ".concat(n))}))))})),S=function(e){var t=e.postType,n=e.setAttributes,a=e.className,c=e.clientId;return React.createElement("div",{className:a},React.createElement(v.Card,{size:"large"},React.createElement(v.CardHeader,null,React.createElement(O,{postType:t,clientId:c,setAttributes:n})),React.createElement(v.CardBody,null,React.createElement(k,{postType:t,setAttributes:n}))))},_=function(e){var t=e.id,n=e.postType,a=e.title,i=e.lastUpdated,s=e.clientId,d=e.setAttributes,u=void 0!==d&&d,p=(e.isSelected,Object(h.useSelect)((function(e){return e("core/block-editor").getBlock(s)}),[])),m=Object(r.useState)(!1),b=Object(o.a)(m,2),R=b[0],E=b[1],O=g(n),k=Object(h.useSelect)((function(e){return{hasInnerBlocks:0<e("core/block-editor").getBlocks(s).length}}),[s]).hasInnerBlocks,S=Object(h.useDispatch)("core/block-editor").replaceInnerBlocks,_=function(e){var a=e.isSmall,c=void 0!==a&&a;return React.createElement(v.Button,{isSmall:c,isPrimary:!0,onClick:function(){w(s,t,n,S).then((function(e){u({lastUpdated:e.modified_gmt}),E(!1)}))}},Object(l.__)("Update Content"))},j=function(e){var t=e.isSmall,n=void 0!==t&&t;if(!1===k)return React.createElement(r.Fragment,null);var i=function(){var e,t,n=(e=p.attributes,t=p.innerBlocks,Object(c.getSaveContent)("sethrubenstein/ghost-block",e,t));new wp.api.models[O]({title:a,content:n}).save().then((function(e){u({id:e.id,lastUpdated:e.modified_gmt})}))};return React.createElement(v.Button,{isSmall:n,isSecondary:!0,onClick:function(){return i()}},Object(l.__)("Save As New ".concat(O)))},T=function(){(console.info("Watching for updates..."),1!==t)&&new wp.api.models[O]({id:t}).fetch().then((function(e){i!==e.modified_gmt&&E(!0)}))};Object(y.a)((function(){T(),setInterval(T,3e4)}));var I="".concat(O," Settings");return React.createElement(r.Fragment,null,!0===R&&React.createElement("div",{style:{fontSize:"13px",fontFamily:"sans-serif",color:"gray",display:"flex",alignItems:"center"}},React.createElement(v.Dashicon,{icon:"update",style:{marginRight:"11px"}}),"This ",O," has updated content."),React.createElement("div",{style:{display:"flex"}},!0===R&&React.createElement("div",null,React.createElement(_,{isSmall:!0})),React.createElement("div",null,React.createElement(j,{isSmall:!0}))),React.createElement(f.InspectorControls,null,React.createElement(v.Panel,null,React.createElement(v.PanelBody,{title:Object(l.__)(I),initialOpen:!0},React.createElement(v.PanelRow,null,React.createElement(v.TextControl,{label:"Title",value:a,onChange:function(e){return u({title:e})}})),React.createElement(v.PanelRow,null,React.createElement(v.TextControl,{label:"ID",value:t,disabled:!0})),React.createElement(v.PanelRow,null,React.createElement(v.TextControl,{label:"Post Type",value:O,disabled:!0})),!0===R&&React.createElement(v.PanelRow,null,React.createElement(_,null)),React.createElement(v.PanelRow,null,React.createElement(j,null)),React.createElement(v.PanelRow,null,React.createElement(v.Button,{isLink:!0},Object(l.__)("Edit In New Window")))))))},j=function(e){var t=e.id,n=e.postType,a=e.title,c=e.lastUpdated,l=e.clientId,i=e.isSelected,o=void 0!==i&&i,s=e.setAttributes,d=void 0!==s&&s,u=e.className,p=void 0===u?"":u,m=e.allowedBlocks,b=void 0===m?null:m;return!1===d?React.createElement(f.InnerBlocks.Content,null):0===t?React.createElement(S,{postType:n,setAttributes:d,className:p,clientId:l}):React.createElement(r.Fragment,null,!1!==d&&React.createElement(r.Fragment,null,React.createElement(f.InnerBlocks,{allowedBlocks:b}),React.createElement(_,{id:t,postType:n,title:a,lastUpdated:c,clientId:l,setAttributes:d,isSelected:o})))},T=function(e){var t=e.attributes,n=e.className,a=e.clientId,c=e.setAttributes,l=e.isSelected,o=t.title,r=t.lastUpdated,s=t.id;return 0===t.uuid&&c({uuid:Object(i.v1)()}),0!==s&&""!==o?React.createElement(m,{className:n,title:o,postType:"topic"},React.createElement(j,{id:s,postType:"topic",title:o,lastUpdated:r,setAttributes:c,clientId:a,isSelected:l})):React.createElement(j,{id:s,postType:"topic",title:o,lastUpdated:r,setAttributes:c,clientId:a,isSelected:l})},I=function(e){var t=e.attributes,n=e.className,a=e.clientId,c=t.title,l=t.lastUpdated,i=t.id,o=t.uuid;return React.createElement("div",{className:n,"data-title":c,"data-uuid":o},React.createElement(j,{id:i,postType:"topic",title:c,lastUpdated:l,setAttributes:!1,clientId:a}))},x=["easyteachlms/topic",{title:Object(l.__)("Topic"),description:"Block Desc.",category:"education",keywords:[Object(l.__)("Topic")],supports:{html:!1,align:!1},attributes:{id:{type:"integer",default:0},lastUpdated:{type:"string",default:0},title:{type:"string",default:""},uuid:{type:"string",default:0}},parent:["easyteachlms/lesson"],edit:T,save:I}];n(318);c.registerBlockType.apply(void 0,Object(a.a)(x))},51:function(e,t){e.exports=wp.blocks},61:function(e,t){e.exports=wp.data},68:function(e,t){e.exports=ReactDOM},69:function(e,t){e.exports=wp.blockEditor}},[[193,1,2]]]);
//# sourceMappingURL=block-a6f1ff83.js.map