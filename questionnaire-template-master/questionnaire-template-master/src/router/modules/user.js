const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * auth  微信授权
 * noUsr 是否无用户版本
 */
const userRoute = [{
  path: "/user",
  name: "user",
  component: _import("user"),
  meta: {
    title: "我的",
    auth: false,
    nav:true
  }
},{
  path: "/myRepot",
  name: "myRepot",
  component: _import("myReport"),
  meta: {
    title: "我的报告",
    auth: false,
    nav:true
  }
}]

export default userRoute
