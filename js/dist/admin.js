module.exports=function(e){var n={};function r(o){if(n[o])return n[o].exports;var t=n[o]={i:o,l:!1,exports:{}};return e[o].call(t.exports,t,t.exports,r),t.l=!0,t.exports}return r.m=e,r.c=n,r.d=function(e,n,o){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var t in e)r.d(o,t,function(n){return e[n]}.bind(null,t));return o},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=27)}({0:function(e,n){e.exports=flarum.core.compat.app},13:function(e,n){e.exports=flarum.core.compat["models/Group"]},27:function(e,n,r){"use strict";r.r(n);var o=r(0),t=r.n(o),a=r(6),s=r.n(a),i=r(13),l=r.n(i),u="clarkwinkelmann-who-read.admin.settings.";t.a.initializers.add("clarkwinkelmann-who-read",(function(){t.a.extensionData.for("clarkwinkelmann-who-read").registerSetting((function(){var e=this,n=this.setting("who-read.onlyGroups","")().split(",").filter((function(e){return e>0}));return[m(".Form-group",[s.a.component({state:"1"===this.setting("who-read.showInDiscussionList","1")(),onchange:function(n){e.setting("who-read.showInDiscussionList")(n?"1":"0")}},t.a.translator.trans(u+"show-in-discussion-list"))]),m(".Form-group",[s.a.component({state:"1"===this.setting("who-read.showInHero","1")(),onchange:function(n){e.setting("who-read.showInHero")(n?"1":"0")}},t.a.translator.trans(u+"show-in-hero"))]),m(".Form-group",[s.a.component({state:"1"===this.setting("who-read.showBetweenPosts","1")(),onchange:function(n){e.setting("who-read.showBetweenPosts")(n?"1":"0")}},t.a.translator.trans(u+"show-between-posts"))]),m(".Form-group",[s.a.component({state:"1"===this.setting("who-read.showCountOfReadersWhoStopped")(),onchange:function(n){e.setting("who-read.showCountOfReadersWhoStopped")(n?"1":"0")}},t.a.translator.trans(u+"show-count-of-readers-who-stopped"))]),m(".Form-group",[m("label",t.a.translator.trans(u+"hide-when-behind")),m("input.FormControl",{type:"number",bidi:this.setting("who-read.hideWhenBehind"),min:0})]),m(".Form-group",[m("label",t.a.translator.trans(u+"max-visible")),m("input.FormControl",{type:"number",bidi:this.setting("who-read.maxVisible",10),min:0})]),m(".Form-group",[m("label",t.a.translator.trans(u+"unread-icon")),m("input.FormControl",{type:"text",bidi:this.setting("who-read.unreadIcon"),placeholder:"fas fa-eye-dash"})]),m(".Form-group",[m("label",t.a.translator.trans(u+"only-groups")),t.a.store.all("groups").filter((function(e){return e.id()!==l.a.MEMBER_ID&&e.id()!==l.a.GUEST_ID})).map((function(r){return s.a.component({state:-1!==n.indexOf(r.id()),onchange:function(o){var t=[];t=o?[].concat(n,[r.id()]):n.filter((function(e){return e!==r.id()})),e.setting("who-read.onlyGroups")(t.join(","))}},r.nameSingular())}))])]})).registerPermission({icon:"fas fa-book-reader",label:t.a.translator.trans("clarkwinkelmann-who-read.admin.permissions.see-read"),permission:"who-read.seeRead",allowGuest:!0},"view").registerPermission({icon:"fas fa-book-reader",label:t.a.translator.trans("clarkwinkelmann-who-read.admin.permissions.see-subscription"),permission:"who-read.seeSubscription",allowGuest:!0},"view").registerPermission({icon:"fas fa-book-reader",label:t.a.translator.trans("clarkwinkelmann-who-read.admin.permissions.see-unread"),permission:"who-read.seeUnread",allowGuest:!0},"view").registerPermission({icon:"fas fa-book-reader",label:t.a.translator.trans("clarkwinkelmann-who-read.admin.permissions.mark-unread"),permission:"who-read.markUnread"},"reply")}))},6:function(e,n){e.exports=flarum.core.compat["components/Switch"]}});
//# sourceMappingURL=admin.js.map