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
(window["wpackioeasyTeachLMSlesson-blockJsonp"]=window["wpackioeasyTeachLMSlesson-blockJsonp"]||[]).push([[0],{0:function(e,t){e.exports=React},106:function(e,t){e.exports=wp.data},183:function(e,t,a){a(184),e.exports=a(307)},21:function(e,t){e.exports=wp.i18n},26:function(e,t){e.exports=wp.element},306:function(e,t,a){},307:function(e,t,a){"use strict";a.r(t);var c=a(170),n=a(78),l=a(21),s=a(83),o=a(79),r=a(106),i=(a(57),a(320)),u=a(26),p=a(321),m=a(318),y=a(317),d=a(322),b=a(316),k=function(e){var t=e.postType;e.setAttributes;return React.createElement(u.Fragment,null,React.createElement(p.a,{as:"h3",icon:"search",content:Object(l.__)("Search for existing "+t)}),React.createElement(m.a,{placeholder:Object(l.__)("Select "+t),fluid:!0,search:!0,selection:!0,options:[{key:"a",value:"a",text:"Post A"},{key:"b",value:"b",text:"Post B"},{key:"c",value:"c",text:"Post C"},{key:"d",value:"d",text:"Post D"},{key:"e",value:"e",text:"Post E"},{key:"f",value:"f",text:"Post F"},{key:"g",value:"g",text:"Post G"},{key:"h",value:"h",text:"Post H"},{key:"i",value:"i",text:"Post I"},{key:"j",value:"j",text:"Post J"},{key:"l",value:"l",text:"Post L"},{key:"k",value:"k",text:"Post K"}],onChange:function(e){return console.log(e)},style:{fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",fontSize:"14px"}}))},f=Object(i.a)({title:""})((function(e){var t=e.title,a=e.postType,c=e.setState,n=e.setAtttributes;return React.createElement(u.Fragment,null,React.createElement(p.a,{as:"h3",icon:"add",content:Object(l.__)("Start a new "+a)}),React.createElement(y.a,{onSubmit:function(){var e,c=new(wp.api.models[(e=a,"string"!=typeof e?"":e.charAt(0).toUpperCase()+e.slice(1))])({title:t});c.save(),n({title:t,id:c.id})}},React.createElement(y.a.Group,null,React.createElement(y.a.Input,{placeholder:"Title",name:"title",value:t,onChange:function(e,t){t.name;var a=t.value;c({title:a})}}),React.createElement(y.a.Button,{color:"teal",icon:"add",content:Object(l.__)("Create "+a)}))))})),v=function(e){var t=e.postType,a=e.title,c=(e.id,e.size,e.setAttributes),n=e.className;return React.createElement("div",{className:n},React.createElement(d.a,{textAlign:"center"},React.createElement(k,{postType:t}),React.createElement(b.a,{horizontal:!0},React.createElement("span",{style:{fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",fontSize:"14px"}},"Or")),React.createElement(f,{title:a,postType:t,setAtttributes:c})))},h=a(4),E=a.n(h),R=function(e){var t=e.title,a=e.postType,c=e.className,n=e.children,o=Object(u.useState)(!0),r=Object(s.a)(o,2),i=r[0],m=r[1],y=i?"down":"right";return React.createElement("div",{className:E()(c,{collapsed:!i})},React.createElement("div",{className:"collapsible-title"},React.createElement(p.a,{as:"h4",icon:"caret "+y,content:Object(l.__)(a.toUpperCase()+" "+t),onClick:function(e){m(!i)}})),React.createElement("div",{className:"collapsible-content"},n))},x=["easyteachlms/topic"],g=function(e){var t=e.attributes,a=e.className,c=e.clientId,n=e.name,l=e.setAttributes,s=t.id,i=t.title,u=Object(r.useSelect)((function(e){return{blockType:(0,e("core/blocks").getBlockType)(n),hasInnerBlocks:e("core/block-editor").getBlocks(c).length>0}}),[c,n]);u.blockType,u.hasInnerBlocks,Object(r.useDispatch)("core/block-editor").replaceInnerBlocks;return 0!==s&&""!==i?React.createElement(R,{className:a,title:i,postType:"lesson"},React.createElement(o.InnerBlocks,{allowedBlocks:x})):React.createElement(v,{title:i,postType:"lesson",setAttributes:l,className:a})},_=function(e){var t=e.attributes,a=e.className,c=t.title;t.lessonID;return React.createElement("div",{className:a},React.createElement("h2",null,c),React.createElement(o.InnerBlocks.Content,null))},j=["easyteachlms/lesson",{title:Object(l.__)("Lesson"),description:"Block Desc.",category:"education",keywords:[Object(l.__)("Key 1"),Object(l.__)("Key 2"),Object(l.__)("Key 3")],supports:{html:!1,align:!0},attributes:{id:{type:"integer",default:0},title:{type:"string",default:""}},edit:g,save:_}];a(306);n.registerBlockType.apply(void 0,Object(c.a)(j))},57:function(e,t){e.exports=lodash},58:function(e,t){e.exports=ReactDOM},78:function(e,t){e.exports=wp.blocks},79:function(e,t){e.exports=wp.blockEditor}},[[183,1,2]]]);
//# sourceMappingURL=block-1292d203.js.map