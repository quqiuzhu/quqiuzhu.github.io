webpackJsonp([14],{G9hl:function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div")},a=[],u={render:r,staticRenderFns:a};e.a=u},O8ny:function(t,e,n){"use strict";var r=n("yEme");e.a={data:function(){return{}},methods:{buyPackage:function(){n.i(r.a)(this.$route.params.type).then(function(t){WP.click(t),WP.err=function(t){this.$message({message:"支付失败",type:"warning"}),console.log(t)}}).catch(function(){})}}}},jeRH:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("O8ny"),a=n("G9hl"),u=n("VU/8"),c=u(r.a,a.a,null,null,null);e.default=c.exports},yEme:function(t,e,n){"use strict";function r(t){return n.i(c.a)({url:"/counter/buy",method:"post",data:{package:t}})}function a(t){return n.i(c.a)({url:"/counter/orders",method:"get",params:t})}function u(t,e){return n.i(c.a)({url:"/order/"+t,method:"put",data:e})}e.a=r,e.c=a,e.b=u;var c=n("Vo7i")}});
//# sourceMappingURL=14.7c83988c2ce6a9bd5e7c.js.map