(function(t){function e(e){for(var o,r,s=e[0],c=e[1],l=e[2],d=0,h=[];d<s.length;d++)r=s[d],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&h.push(a[r][0]),a[r]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);u&&u(e);while(h.length)h.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],o=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(o=!1)}o&&(i.splice(e--,1),t=r(r.s=n[0]))}return t}var o={},a={app:0},i=[];function r(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=o,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var u=c;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},"56d7":function(t,e,n){"use strict";n.r(e);var o=n("53ca"),a=(n("e260"),n("e6cf"),n("cca6"),n("a79d"),n("d3b7"),n("2b0e")),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-link",{attrs:{to:"/"}}),n("router-view")],1)},r=[],s={name:"App"},c=s,l=(n("034f"),n("2877")),u=Object(l["a"])(c,i,r,!1,null,null,null),d=u.exports,h=n("8c4f"),p=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"home"},[o("van-nav-bar",{staticClass:"safe-area-top",attrs:{title:"设备列表"}}),o("van-list",t._l(t.devs,(function(e,a){return o("van-cell",{key:a,attrs:{title:e.alias,label:e.devId,icon:n("9767"),"is-link":"true",center:"false","value-class":"cell-value"},on:{click:function(n){return t.loginDev(e)}}})})),1),o("input-dialog",{attrs:{show:t.show,dev:t.curDev},on:{close:t.onDialog}})],1)},f=[],v=n("bc3a"),g=n.n(v),m={token:"",srand:""};function w(){return{token:m.token,srand:m.srand}}function y(t){m.token=t}function b(t){m.srand=t}function k(){return{"edger-token":m.token,"edger-srand":m.srand}}var O=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("van-dialog",{attrs:{title:"输入账号","show-cancel-button":""},on:{open:t.onOpen,confirm:function(e){return t.onInputDlg(!0)},cancel:function(e){return t.onInputDlg(!1)}},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("van-cell-group",[n("van-field",{attrs:{label:"账号",placeholder:"请输入账号"},model:{value:t.user,callback:function(e){t.user=e},expression:"user"}}),n("van-field",{attrs:{type:"password",label:"密码"},model:{value:t.pwd,callback:function(e){t.pwd=e},expression:"pwd"}})],1)],1)],1)},x=[],j=n("2241"),C={name:"InputDialog",props:["show","dev"],data:function(){return{user:"admin",pwd:"admin"}},methods:{onInputDlg:function(t){console.log("ret:"+t),this.$emit("close",t,this.dev,this.user,this.pwd)},onOpen:function(){this.user="admin",this.pwd="admin"}},components:{"van-dialog":j["a"].Component}},_=C,$=Object(l["a"])(_,O,x,!1,null,null,null),P=$.exports,S={name:"Home",data:function(){return{show:!1,curDev:null,devs:[]}},methods:{loginDev:function(t){var e=this;console.log("login dev:"+t.alias),t.status?this.$router.push({name:"Camera",params:t}):(this.curDev=t,g.a.post("/api/login",{devId:t.devId},{headers:k()}).then((function(n){n.data.result?(t.path=n.data.path,t.status=!0,e.$router.push({name:"Camera",params:t})):e.$notify({type:"danger",message:"非摄像头设备或者账号错误！"})})).catch((function(t){400===t.status?e.$notify({type:"danger",message:"参数错误！"}):503===t.status?(e.$notify({type:"danger",message:t.error}),console.log(t.error)):403===t.status?(e.$notify({type:"danger",message:"无访问权限！"}),console.log("无访问权限！")):(e.$notify({type:"danger",message:"未知错误！"}),console.log("未知错误！"))})))},loadDevs:function(){var t=this;console.log("load devs."),g.a.get("/api/list",{headers:k()}).then((function(e){t.devs=e.data})).catch((function(e){400===e.status?t.$notify({type:"danger",message:"参数错误！"}):503===e.status?(t.$notify({type:"danger",message:e.error}),console.log(e.error)):403===e.status?(t.$notify({type:"danger",message:"无访问权限！"}),console.log("无访问权限！")):(t.$notify({type:"danger",message:"未知错误！"}),console.log("未知错误！"))}))}},created:function(){var t=this;this.loadDevs(),setInterval((function(){t.loadDevs()}),5e3)},components:{"input-dialog":P}},D=S,E=Object(l["a"])(D,p,f,!1,null,null,null),I=E.exports,M=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"about"},[n("van-nav-bar",{staticClass:"safe-area-top",attrs:{title:"在线监控","left-arrow":""},on:{"click-left":function(e){return t.goBack()}}}),n("player",{attrs:{dev:t.dev}})],1)},H=[],W=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"about"},[n("div",{staticClass:"canvas-wrapper",style:{position:"relative",width:t.width+"px",height:t.height+"px"}},[n("canvas",{style:{position:"absolute",width:t.width+"px",height:t.height+"px"},attrs:{id:"video"}}),n("canvas",{style:{position:"absolute"},attrs:{id:"layout",width:t.width,height:t.height}})]),n("div",{staticClass:"menu"},[n("van-button",{on:{click:function(e){return t.startPlay()}}},[t._v("播放")]),n("van-button",{on:{click:function(e){return t.stopPlay()}}},[t._v("停止")])],1)])},A=[],N=(n("99af"),n("d4ec")),B=n("bee2"),R=n("257e"),T=n("45eb"),J=n("7e84"),q=n("262e"),z=n("2caf");function F(t,e,n,o,a){var i=function(t){Object(q["a"])(n,t);var e=Object(z["a"])(n);function n(t,o,a,i){var r;return Object(N["a"])(this,n),r=e.call(this,t,i,a),r.canvas=o,r.ctx=r.canvas.getContext("2d"),r.canvaw=a.canvaw,r.canvah=a.canvah,r.videow=1280,r.videoh=720,r.rw=r.canvaw/r.videow,r.rh=r.canvah/r.videoh,r.ctx.clearRect(0,0,r.canvaw,r.canvah),r.on("data",r.onData.bind(Object(R["a"])(r))),r}return Object(B["a"])(n,[{key:"_uninit",value:function(){this.canvas=null,this.ctx=null,Object(T["a"])(Object(J["a"])(n.prototype),"_uninit",this).call(this)}},{key:"draw",value:function(t){if(Array.isArray(t)){this.ctx.clearRect(0,0,this.canvaw,this.canvah);for(var e=t.length,n=this.ctx,o=0;o<e;o++){var a=t[o],i=a.x0*this.rw,r=a.y0*this.rh,s=(a.x1-a.x0)*this.rw,c=(a.y1-a.y0)*this.rh;n.strokeStyle="#00FF00",n.strokeRect(i,r,s,c)}}}},{key:"onData",value:function(t,e,n){var o=e&&e.type?e.type:null;"media"===o?(console.log("media info:"+n),this.videow=n.width,this.videoh=n.height,this.rw=this.canvaw/this.videow,this.rh=this.canvah/this.videoh):"face"===o?this.draw(n):console.error("Data invalid.")}}]),n}(t);return new i(e,n,o,a)}var V={name:"Player",props:["dev"],data:function(){return{isStarting:!1,width:360,height:202}},methods:{startPlay:function(){console.log("Start play."),this.isStarting||(console.log("Start."),this.isStarting=!0,this.mediaClient.open(w()))},stopPlay:function(){this.isStarting&&(console.log("Stop."),this.mediaClient.close())},getPageSize:function(){var t={width:0,height:0};window.innerWidth&&window.innerHeight?(t.width=window.innerWidth,t.height=window.innerHeight):document.body&&document.body.clientWidth&&document.body.clientHeight?(t.width=document.body.clientWidth,t.height=document.body.clientHeight):document.documentElement&&document.documentElement.clientHeight&&document.documentElement.clientWidth&&(t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight);var e=t.width,n=parseInt(9*t.width/16);return this.width=e,this.height=n,{w:e,h:n}}},mounted:function(){var t=this,e=this.getPageSize(),n=e.w,o=e.h;this.np=new NodePlayer,this.np.setBufferTime(512),this.np.setView("video"),this.np.on("stats",(function(t){console.log(t)})),console.log("Create media client.");var a=document.getElementById("layout"),i="http:"===location.protocol?"ws:":"wss:",r="".concat(i,"//").concat(window.location.host),s=F(MediaClient,r,a,{canvaw:n,canvah:o,path:this.dev.path},(function(e,n){t.np.start(r+n)}));this.mediaClient=s,s.on("open",(function(){console.log("MediaClient on open")})),s.on("close",(function(){console.log("MediaClient on close"),t.np.stop(),t.isStarting=!1}))},destroyed:function(){this.stopPlay()}},G=V,K=Object(l["a"])(G,W,A,!1,null,null,null),L=K.exports,Q={name:"Camera",data:function(){return{dev:{}}},methods:{goBack:function(){this.$router.go(-1)}},created:function(){console.log("create"),this.dev=this.$route.params},components:{player:L}},U=Q,X=(n("d4e7"),Object(l["a"])(U,M,H,!1,null,"687ba431",null)),Y=X.exports;a["a"].use(h["a"]);var Z=[{path:"/",name:"Home",component:I},{path:"/Camera",name:"Camera",component:Y}],tt=new h["a"]({mode:"history",base:"/",routes:Z}),et=tt,nt=n("b970"),ot=(n("157a"),n("f564")),at=n("ea0a"),it=(n("ac1f"),n("1276"),n("159b"),["network","ainn","rtsp"]),rt={};function st(t){rt=t}function ct(t){if(-1!==t.indexOf(".")){var e=permission.split(".");return this.permsObtain[e[0]][e[1]]}return rt[t]}function lt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:it,e=[];return t.forEach((function(t){ct(t)||e.push(t)})),e}function ut(){var t={code:it,type:"permissions"};at["a"].permission.request(t).then((function(t){console.log("permissionRequest:".concat(JSON.stringify(t)))}))}console.log("undefined"===typeof Module?"undefined":Object(o["a"])(Module)),console.log("undefined"===typeof NodePlayer?"undefined":Object(o["a"])(NodePlayer)),a["a"].config.productionTip=!1,a["a"].use(nt["a"]),a["a"].use(ot["a"]),at["a"].onAction("permission",(function(t){st(t)})),at["a"].onAction("token",(function(t){var e=t.token,n=t.srand;y(e),b(n)})),at["a"].token().then((function(t){var e=t.token,n=t.srand;y(e),b(n)})).then((function(){var t=lt();t.length>0&&ut()})).catch((function(t){console.error(t)})).finally((function(){NodePlayer.load((function(){new a["a"]({router:et,render:function(t){return t(d)}}).$mount("#app")}))}))},"85ec":function(t,e,n){},"90a6":function(t,e,n){},9767:function(t,e,n){t.exports=n.p+"img/camera.48ffc127.png"},d4e7:function(t,e,n){"use strict";n("90a6")}});
//# sourceMappingURL=app.6aca0391.js.map