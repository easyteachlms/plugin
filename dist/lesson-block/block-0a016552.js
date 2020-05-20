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
(window["wpackioeasyTeachLMSlesson-blockJsonp"]=window["wpackioeasyTeachLMSlesson-blockJsonp"]||[]).push([[0],{0:function(e,t){e.exports=React},106:function(e,t){e.exports=wp.data},183:function(e,t,a){a(184),e.exports=a(307)},21:function(e,t){e.exports=wp.i18n},26:function(e,t){e.exports=wp.element},306:function(e,t,a){},307:function(e,t,a){"use strict";a.r(t);var n=a(170),c=a(78),l=a(21),s=a(83),o=a(79),i=a(106),r=(a(57),a(320)),u=a(26),p=a(321),m=a(318),d=a(317),b=a(322),y=a(316),v=function(e){var t=e.postType;e.setAttributes;return React.createElement(u.Fragment,null,React.createElement(p.a,{as:"h3",icon:"search",content:Object(l.__)("Search for existing "+t)}),React.createElement(m.a,{placeholder:Object(l.__)("Select "+t),fluid:!0,search:!0,selection:!0,options:[{key:"a",value:"a",text:"Post A"},{key:"b",value:"b",text:"Post B"},{key:"c",value:"c",text:"Post C"},{key:"d",value:"d",text:"Post D"},{key:"e",value:"e",text:"Post E"},{key:"f",value:"f",text:"Post F"},{key:"g",value:"g",text:"Post G"},{key:"h",value:"h",text:"Post H"},{key:"i",value:"i",text:"Post I"},{key:"j",value:"j",text:"Post J"},{key:"l",value:"l",text:"Post L"},{key:"k",value:"k",text:"Post K"}],onChange:function(e){return console.log(e)},style:{fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",fontSize:"14px"}}))},k=Object(r.a)({title:""})((function(e){var t=e.title,a=e.postType,n=e.setState,c=e.setAtttributes;return React.createElement(u.Fragment,null,React.createElement(p.a,{as:"h3",icon:"add",content:Object(l.__)("Start a new "+a)}),React.createElement(d.a,{onSubmit:function(){var e,n=new(wp.api.models[(e=a,"string"!=typeof e?"":e.charAt(0).toUpperCase()+e.slice(1))])({title:t});n.save(),c({title:t,id:n.id})}},React.createElement(d.a.Group,null,React.createElement(d.a.Input,{placeholder:"Title",name:"title",value:t,onChange:function(e,t){t.name;var a=t.value;n({title:a})}}),React.createElement(d.a.Button,{color:"teal",icon:"add",content:Object(l.__)("Create "+a)}))))})),f=function(e){var t=e.postType,a=e.title,n=(e.id,e.size,e.setAttributes),c=e.className;return React.createElement("div",{className:c},React.createElement(b.a,{textAlign:"center"},React.createElement(v,{postType:t}),React.createElement(y.a,{horizontal:!0},React.createElement("span",{style:{fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",fontSize:"14px"}},"Or")),React.createElement(k,{title:a,postType:t,setAtttributes:n})))},h=a(4),E=a.n(h),R=function(e){var t=e.title,a=e.postType,n=e.className,c=e.children,o=Object(u.useState)(!0),i=Object(s.a)(o,2),r=i[0],m=i[1],d=r?"down":"right";return React.createElement("div",{className:E()(n,{collapsed:!r})},React.createElement("div",{className:"collapsible-title"},React.createElement(p.a,{as:"h4",icon:"caret "+d,content:Object(l.__)(a.toUpperCase()+" "+t),onClick:function(e){m(!r)}})),React.createElement("div",{className:"collapsible-content"},c))},x=["easyteachlms/topic"],w=function(e){var t=e.attributes,a=e.className,n=e.clientId,c=e.name,l=e.setAttributes,s=t.id,r=t.title,u=Object(i.useSelect)((function(e){return{blockType:(0,e("core/blocks").getBlockType)(c),hasInnerBlocks:e("core/block-editor").getBlocks(n).length>0}}),[n,c]);u.blockType,u.hasInnerBlocks,Object(i.useDispatch)("core/block-editor").replaceInnerBlocks;return 0!==s?React.createElement("div",null,React.createElement("p",null,"We have an existing lesson! You will not be able to edit the lesson because its stored in the database."),React.createElement("p",null,"We will have an edit button that will open in a new window the lesson editor.")):0===s&&""!==r?React.createElement(R,{className:a,title:r,postType:"lesson"},React.createElement(o.InnerBlocks,{allowedBlocks:x})):React.createElement(f,{title:r,postType:"lesson",setAttributes:l,className:a})},g=function(e){var t=e.attributes,a=e.className,n=t.title;t.lessonID;return React.createElement("div",{className:a},React.createElement("h2",null,n),React.createElement(o.InnerBlocks.Content,null))},_=["easyteachlms/lesson",{title:Object(l.__)("Lesson"),description:"Block Desc.",category:"education",keywords:[Object(l.__)("Key 1"),Object(l.__)("Key 2"),Object(l.__)("Key 3")],supports:{html:!1,align:!0},attributes:{id:{type:"integer",default:0},title:{type:"string",default:""}},edit:w,save:g}];a(306);c.registerBlockType.apply(void 0,Object(n.a)(_))},57:function(e,t){e.exports=lodash},58:function(e,t){e.exports=ReactDOM},78:function(e,t){e.exports=wp.blocks},79:function(e,t){e.exports=wp.blockEditor}},[[183,1,2]]]);
//# sourceMappingURL=block-0a016552.js.map