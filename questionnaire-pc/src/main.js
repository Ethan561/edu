import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'

import "@/style/base.scss";
import "@/assets/font/iconfont.css";
import { isDebugMode } from '@/config';
// 按需引入ui
import '@/uiLibs'

import VueWechatTitle from "vue-wechat-title";
Vue.use(VueWechatTitle);

import thumbsimg from '@/MyPlugin/thumbsimg/toThumbsimg.js'
Vue.use(thumbsimg)
// import VConsole from "vconsole";
// !isDebugMode && new VConsole();

Vue.config.debug = isDebugMode;
Vue.config.devtools = isDebugMode;
Vue.config.productionTip = isDebugMode;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
