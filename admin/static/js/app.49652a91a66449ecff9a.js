webpackJsonp([16],{"+fWl":function(e,t,n){"use strict";function r(e){n("fRDX")}Object.defineProperty(t,"__esModule",{value:!0});var a=n("z0eO"),o=n("g4jC"),i=n("VU/8"),s=r,u=i(a.a,o.a,s,"data-v-533b1366",null);t.default=u.exports},"/N9D":function(e,t,n){"use strict";var r=n("Dd8w"),a=n.n(r),o=n("NYxO");t.a={computed:a()({},n.i(o.b)(["sidebar","name","avatar"])),methods:{toggleSideBar:function(){this.$store.dispatch("ToggleSideBar")},logout:function(){this.$store.dispatch("LogOut").then(function(){location.reload()})}}}},"0kte":function(e,t,n){"use strict";function r(e){n("jxdt")}Object.defineProperty(t,"__esModule",{value:!0});var a=n("/N9D"),o=n("yfFw"),i=n("VU/8"),s=r,u=i(a.a,o.a,s,"data-v-6587b698",null);t.default=u.exports},"0pCd":function(e,t){},A66B:function(e,t,n){e.exports=function(e){return function(){return n("Opzk")("./"+e+".vue")}}},B2Vc:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._l(e.routes,function(t){return[!t.hidden&&t.noDropdown&&t.children.length>0?n("router-link",{attrs:{to:t.path+"/"+t.children[0].path}},[n("el-menu-item",{attrs:{index:t.path+"/"+t.children[0].path}},[n("i",{class:t.icon,attrs:{"aria-hidden":"true"}}),e._v(" "+e._s(t.children[0].name)+"\n      ")])],1):e._e(),e._v(" "),t.noDropdown||t.hidden?e._e():n("el-submenu",{attrs:{index:t.name}},[n("template",{slot:"title"},[n("i",{class:t.icon,attrs:{"aria-hidden":"true"}}),e._v(" "+e._s(t.name)+"\n      ")]),e._v(" "),e._l(t.children,function(r){return r.hidden?e._e():[r.children&&r.children.length>0?n("sidebar-item",{staticClass:"menu-indent",attrs:{routes:[r]}}):n("router-link",{staticClass:"menu-indent",attrs:{to:t.path+"/"+r.path}},[n("el-menu-item",{attrs:{index:t.path+"/"+r.path}},[e._v("\n            "+e._s(r.name)+"\n          ")])],1)]})],2)]})],2)},a=[],o={render:r,staticRenderFns:a};t.a=o},ECqA:function(e,t,n){"use strict";t.a={created:function(){this.getBreadcrumb()},data:function(){return{levelList:null}},methods:{getBreadcrumb:function(){var e=this.$route.matched.filter(function(e){return e.name}),t=e[0];!t||"首页"===t.name&&""===t.path||(e=[{name:"首页",path:"/"}].concat(e)),this.levelList=e}},watch:{$route:function(){this.getBreadcrumb()}}}},"F+/V":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("FUIY"),a=n("ZLju"),o=n("VU/8"),i=o(r.a,a.a,null,null,null);t.default=i.exports},FUIY:function(e,t,n){"use strict";t.a={name:"AppMain",computed:{key:function(){return void 0!==this.$route.name?this.$route.name+ +new Date:this.$route+ +new Date}}}},IcnI:function(e,t,n){"use strict";var r=n("7+uW"),a=n("NYxO"),o=n("WSTi"),i=n("bREw"),s=n("UjVw");r.default.use(a.a);var u=new a.a.Store({modules:{app:o.a,user:i.a},getters:s.a});t.a=u},"K/TB":function(e,t,n){"use strict";function r(e){n("0pCd")}Object.defineProperty(t,"__esModule",{value:!0});var a=n("ECqA"),o=n("bX+u"),i=n("VU/8"),s=r,u=i(a.a,o.a,s,"data-v-b79aa614",null);t.default=u.exports},M93x:function(e,t,n){"use strict";function r(e){n("WudQ")}var a=n("xJD8"),o=n("jmEo"),i=n("VU/8"),s=r,u=i(a.a,o.a,s,null,null);t.a=u.exports},M9A7:function(e,t,n){"use strict";function r(e){return n.i(i.a)({url:"/user/captcha",method:"post",data:{phone:e}})}function a(e,t,r){return n.i(i.a)({url:"/user/login",method:"post",data:{phone:e,password:t,code:r}})}function o(){return n.i(i.a)({url:"/user/logout",method:"post"})}t.c=r,t.a=a,t.b=o;var i=n("Vo7i")},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("7+uW"),a=n("zL8q"),o=n.n(a),i=n("q8zI"),s=(n.n(i),n("Vi3T")),u=n.n(s),c=n("e0XP"),d=(n.n(c),n("M93x")),l=n("YaEn"),f=n("IcnI");r.default.use(o.a,{locale:u.a}),r.default.config.productionTip=!1,new r.default({el:"#app",router:l.a,store:f.a,template:"<App/>",components:{App:d.a}})},NNxB:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-home"},[n("div",{staticClass:"app-header"},[n("app-header")],1),e._v(" "),n("div",{staticClass:"app-content",class:{hideSidebar:!e.sidebar.opened}},[n("sidebar",{staticClass:"app-sidebar"}),e._v(" "),n("div",{staticClass:"main-container"},[n("app-main")],1)],1)])},a=[],o={render:r,staticRenderFns:a};t.a=o},Opzk:function(e,t,n){function r(e){var t=a[e];return t?Promise.all(t.slice(1).map(n.e)).then(function(){return n(t[0])}):Promise.reject(new Error("Cannot find module '"+e+"'."))}var a={"./common/404.vue":["7FDS",10],"./common/buy.vue":["jeRH",14],"./common/login.vue":["wQTO",5],"./dashboard/index.vue":["ARoL",0],"./home/AppHeader.vue":["0kte"],"./home/AppMain.vue":["F+/V"],"./home/Navbar.vue":["K/TB"],"./home/Sidebar.vue":["+fWl"],"./home/SidebarItem.vue":["h9oN"],"./home/Structure.vue":["tjQU"],"./order/index.vue":["e+iX",9],"./order/price.vue":["V7/b",13],"./product/editor.vue":["EgoN",8],"./product/index.vue":["SKi1",4],"./server/assign.vue":["NtsN",12],"./server/editor.vue":["iGW1",7],"./server/index.vue":["4IFq",2],"./server/item.vue":["s8Px",1],"./user/editor.vue":["5Ft8",6],"./user/index.vue":["md3T",3],"./user/member.vue":["QY6Y",11]};r.keys=function(){return Object.keys(a)},e.exports=r,r.id="Opzk"},PUmA:function(e,t){},Pl7X:function(e,t){},TIfe:function(e,t,n){"use strict";function r(){return c.a.get(d)}function a(e){return c.a.set(d,e)}function o(){return c.a.remove(d)}function i(){return c.a.getJSON(l)}function s(e){return c.a.set(l,e)}t.a=r,t.c=a,t.e=o,t.b=i,t.d=s;var u=n("lbHh"),c=n.n(u),d="token-for-ticks",l="user-for-ticks"},U5FJ:function(e,t,n){"use strict";t.a={name:"SidebarItem",props:{routes:{type:Array}}}},UjVw:function(e,t,n){"use strict";var r={sidebar:function(e){return e.app.sidebar},token:function(e){return e.user.token},avatar:function(e){return e.user.info.avatar},name:function(e){return e.user.info.name},roles:function(e){return e.user.info.roles}};t.a=r},Vo7i:function(e,t,n){"use strict";var r=n("//Fk"),a=n.n(r),o=n("mtWM"),i=n.n(o),s=n("mw3O"),u=n.n(s),c=n("IcnI"),d=n("zL8q"),l=(n.n(d),i.a.create({baseURL:"https://api.quqiuzhu.com/api",timeout:8e3,headers:{"Content-Type":"application/x-www-form-urlencoded"},transformRequest:[function(e){return e=u.a.stringify(e)}]}));l.interceptors.request.use(function(e){return c.a.getters.token&&(e.headers.token=c.a.getters.token),e},function(e){console.log(e),a.a.reject(e)}),l.interceptors.response.use(function(e){var t=e.data;return 200!==t.code?(n.i(d.Message)({message:t.data.msg,type:"error",duration:5e3}),a.a.reject("error")):t.data},function(e){return console.log("err"+e),n.i(d.Message)({message:"网络错误，请检查网络连接",type:"error",duration:5e3}),a.a.reject(e)}),t.a=l},VzoM:function(e,t,n){"use strict";var r=n("K/TB");n.d(t,"a",function(){return r.default});var a=n("+fWl");n.d(t,"b",function(){return a.default});var o=n("F+/V");n.d(t,"c",function(){return o.default});var i=n("0kte");n.d(t,"d",function(){return i.default})},WSTi:function(e,t,n){"use strict";var r=n("lbHh"),a=n.n(r),o={state:{sidebar:{opened:!+a.a.get("sidebarStatus")}},mutations:{TOGGLE_SIDEBAR:function(e){e.sidebar.opened?a.a.set("sidebarStatus",1):a.a.set("sidebarStatus",0),e.sidebar.opened=!e.sidebar.opened}},actions:{ToggleSideBar:function(e){(0,e.commit)("TOGGLE_SIDEBAR")}}};t.a=o},WudQ:function(e,t){},YaEn:function(e,t,n){"use strict";var r=n("7+uW"),a=n("/ocq"),o=n("TIfe"),i=n("tjQU"),s=n("A66B");r.default.use(a.a);var u=[{path:"/login",component:s("common/login"),hidden:!0},{path:"/404",component:s("common/404"),hidden:!0},{path:"/buy/:type",component:s("common/buy"),hidden:!0},{path:"/users",component:i.default,redirect:"/users/",icon:"fa fa-users icon",noDropdown:!0,children:[{path:"",name:"用户管理",component:s("user/index"),meta:{role:["admin"]}}]},{path:"/servers",component:i.default,redirect:"/servers/",icon:"fa fa-heart icon",noDropdown:!0,children:[{path:"",name:"服务管理",component:s("server/index"),meta:{role:["admin"]}},{path:":id",name:"服务账号",component:s("server/item"),meta:{role:["admin"]}}]},{path:"/products",component:i.default,redirect:"/products/",icon:"fa fa-shopping-bag icon",noDropdown:!0,children:[{path:"",name:"套餐管理",component:s("product/index"),meta:{role:["admin"]}}]},{path:"/orders",component:i.default,redirect:"/orders/",icon:"fa fa-list-alt icon",noDropdown:!0,children:[{path:"",name:"订单管理",component:s("order/index"),meta:{role:["admin"]}}]},{path:"/",redirect:"/users",hidden:!0},{path:"*",redirect:"/404",hidden:!0}],c=new a.a({scrollBehavior:function(){return{y:0}},routes:u}),d=["/login"];c.beforeEach(function(e,t,r){n.i(o.a)()?"/login"===e.path?r({path:"/"}):r():-1!==d.indexOf(e.path)?r():r("/login")}),t.a=c},ZLju:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"app-main"},[n("transition",{attrs:{name:"fade",mode:"out-in"}},[n("router-view",{key:e.key})],1)],1)},a=[],o={render:r,staticRenderFns:a};t.a=o},bREw:function(e,t,n){"use strict";var r=n("//Fk"),a=n.n(r),o=n("M9A7"),i=n("TIfe"),s={state:{token:n.i(i.a)(),info:n.i(i.b)()},mutations:{SET_TOKEN:function(e,t){e.token=t},SET_INFO:function(e,t){e.info=t}},actions:{Login:function(e,t){var r=e.commit,s=t.phone.trim();return new a.a(function(e,a){n.i(o.a)(s,t.password,t.code).then(function(t){n.i(i.c)(t.token);var a=t.user.avatar,o=t.user.name,s={roles:t.roles,name:o?o.slice(-4):t.user.phone.slice(-4),avatar:a||"static/avatar.png"};n.i(i.d)(s),r("SET_TOKEN",t.token),r("SET_INFO",s),e()}).catch(function(e){a(e)})})},LogOut:function(e){var t=e.commit;e.state;return new a.a(function(e,r){n.i(o.b)().then(function(){t("SET_TOKEN",""),n.i(i.e)(),e()}).catch(function(e){r(e)})})},FedLogOut:function(e){var t=e.commit;return new a.a(function(e){t("SET_TOKEN",""),n.i(i.e)(),e()})}}};t.a=s},"bX+u":function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-col",{staticClass:"breadcrumb-container",attrs:{span:24}},[n("strong",{staticClass:"title"},[e._v(e._s(e.$route.name))]),e._v(" "),n("el-breadcrumb",{staticClass:"breadcrumb-inner",attrs:{separator:"/"}},e._l(e.levelList,function(t,r){return n("el-breadcrumb-item",{key:t.path},["noredirect"===t.redirect||r==e.levelList.length-1?n("router-link",{staticClass:"no-redirect",attrs:{to:""}},[e._v(e._s(t.name))]):n("router-link",{attrs:{to:t.redirect||t.path}},[e._v(e._s(t.name))])],1)}))],1)},a=[],o={render:r,staticRenderFns:a};t.a=o},e0XP:function(e,t){},fRDX:function(e,t){},g4jC:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-menu",{attrs:{mode:"vertical",theme:"light","default-active":e.$route.path}},[n("sidebar-item",{attrs:{routes:e.routes}})],1)},a=[],o={render:r,staticRenderFns:a};t.a=o},h9oN:function(e,t,n){"use strict";function r(e){n("Pl7X")}Object.defineProperty(t,"__esModule",{value:!0});var a=n("U5FJ"),o=n("B2Vc"),i=n("VU/8"),s=r,u=i(a.a,o.a,s,"data-v-8177cbce",null);t.default=u.exports},jmEo:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},a=[],o={render:r,staticRenderFns:a};t.a=o},jxdt:function(e,t){},nyXb:function(e,t,n){"use strict";var r=n("VzoM");t.a={name:"structure",components:{Navbar:r.a,Sidebar:r.b,AppMain:r.c,AppHeader:r.d},computed:{sidebar:function(){return this.$store.state.app.sidebar}}}},q8zI:function(e,t){},tjQU:function(e,t,n){"use strict";function r(e){n("PUmA")}Object.defineProperty(t,"__esModule",{value:!0});var a=n("nyXb"),o=n("NNxB"),i=n("VU/8"),s=r,u=i(a.a,o.a,s,"data-v-ebb38506",null);t.default=u.exports},xJD8:function(e,t,n){"use strict";t.a={name:"app"}},yfFw:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-col",{staticClass:"header",attrs:{span:24}},[n("el-col",{staticClass:"logo",class:e.sidebar.opened?"logo-width":"logo-collapse-width",attrs:{span:10}},[n("span",{staticClass:"logo-img"},[n("img",{attrs:{src:"static/logo.png"}}),e._v("\n      "+e._s(e.sidebar.opened?"管理系统":"")+"\n    ")])]),e._v(" "),n("el-col",{attrs:{span:10}},[n("div",{staticClass:"tools",on:{click:function(t){t.preventDefault(),e.toggleSideBar(t)}}},[n("i",{staticClass:"fa fa-align-justify"}),e._v("\n       \n      "+e._s(e.$route.name)+"\n    ")])]),e._v(" "),n("el-col",{staticClass:"userinfo",attrs:{span:4}},[n("el-dropdown",{attrs:{trigger:"hover"}},[n("span",{staticClass:"el-dropdown-link userinfo-inner"},[n("img",{attrs:{src:e.avatar}}),e._v("\n        "+e._s(e.name)+"\n      ")]),e._v(" "),n("el-dropdown-menu",{slot:"dropdown"},[n("el-dropdown-item",[e._v("我的消息")]),e._v(" "),n("el-dropdown-item",[e._v("设置")]),e._v(" "),n("el-dropdown-item",{attrs:{divided:""},nativeOn:{click:function(t){e.logout(t)}}},[e._v("退出登录")])],1)],1)],1)],1)},a=[],o={render:r,staticRenderFns:a};t.a=o},z0eO:function(e,t,n){"use strict";var r=n("h9oN");t.a={components:{SidebarItem:r.default},computed:{routes:function(){return this.$router.options.routes}}}}},["NHnr"]);
//# sourceMappingURL=app.49652a91a66449ecff9a.js.map