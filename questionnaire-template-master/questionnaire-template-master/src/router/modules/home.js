const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * auth  微信授权
 * noUsr 是否需要登录
 */
const homeRoute = [{
    path: "/home",
    name: "home",
    component: _import("home"),
    meta: {
        title: "天津市教育招生考试院",
        auth: true,
        noUsr: true,
        nav: true
    }
},{
    path: "/qesDetailOpen",
    name: "qesDetailOpen",
    component: _import("qesDetailOpen"),
    meta: {
        title: "开放问卷",
        auth: false,
        noUsr: true,
        nav: true
    }
}, {
    path: "qesDetail",
    name: "qesDetail",
    component: _import("qesDetail"),
    meta: {
        title: "",
        auth: true,
        noUsr: true,
        nav: false
    }
}, {
    path: "qesOrdinaryDetail",
    name: "qesOrdinaryDetail",
    component: _import("qesOrdinaryDetail"),
    meta: {
        title: "",
        auth: true,
        noUsr: true,
        nav: false
    }
}]

export default homeRoute
