/**
 * @Description [路由拦截封装]
 */
import Vue from "vue";
import Router from "vue-router";
import RouterCommon from './common'; // 引入通用模块
import RouterModule from './modules'; // 引入业务逻辑模块

import {
  Session,
} from "@/utils/common.js";
import {
  apiTokenKey,
  isNoUsr
} from "@/config";

Vue.use(Router);

// vue-router ≥3.0版本回调形式以及改成promise api的形式了，返回的是一个promise，如果没有捕获到错误，控制台始终会出现警告，
const routeTypes = ["push", "replace"];
for (let me of routeTypes) {
  const original = Router.prototype[me];
  Router.prototype[me] = function (location) {
    return original.call(this, location).catch(err => err);
  };
}

const router = new Router({
  // mode: "history",
  mode: 'hash',
  // base: '/', //url前缀
  routes: [
    ...RouterCommon,
    ...RouterModule
  ],
  scrollBehavior(to, from, savedPosition) {
    //history模式时生效
    if (savedPosition) {
      return savedPosition;
    } else {
      // 异步滚动操作
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            x: 0,
            y: 0
          });
        }, 0);
      });
    }
  }
});

/**
 * 跳页时，取消上页请求
 * @param {*} callback
 */
const cancelLastReq = (callback = () => { }) => {
  let axiosPromiseArr = window.__axiosPromiseArr || [];
  if (!!axiosPromiseArr && axiosPromiseArr.length) {
    let len = axiosPromiseArr.length;
    while (len--) {
      axiosPromiseArr[len].cancel("cancel");
      axiosPromiseArr.splice(len, 1);
    }
  }
  callback && callback();
};


/**
 * @路由权限控制
 */
const routePermission = (to, from, next) => {
  if (isNoUsr) {
    //1无用户版
    next();
  } else {
    if (to.query.api_token) {
      Session.set(apiTokenKey, to.query.api_token);
      return next();
    }
    // 权限验证
    if (!Session.get(apiTokenKey)&&to.meta.auth) {
      return next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      return next();
    }
  }
}

router.beforeEach((to, from, next) => {
  cancelLastReq(() => {
    routePermission(to, from, next);
  });
});

export default router;
