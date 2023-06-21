const _import = require('./config/_import_' + process.env.NODE_ENV)
import homeRoute from "./modules/home";
import userRoute from "./modules/user"
export default [
  // 默认页
  {
    path: "/",
    name: "layout",
    redirect:'/login',
    component: _import("layout"),
    meta: {
      title: "天津市教育招生考试院",
      auth: false
    },
    children:[
      ...homeRoute,
      ...userRoute
    ]
  },
  {
    path: "/login",
    name: "login",
    component: _import("login"),
    meta: {
      title: "登录",
      auth: false
    }
  },
  // 404
  {
    path: "*",
    name: "404",
    component: resolve => require(["@/components/404"], resolve),
    meta: {
      title: "404"
    }
  }
];
