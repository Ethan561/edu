/** 
 * @Description [http请求封装]
 */
import axios from 'axios'
import qs from "qs" // 序列化请求数据
import _ from 'lodash'
// import wx from 'weixin-js-sdk'

import router from '@/router'
import { baseUrl, apiTokenKey } from '@/config'
import { showToast, hideToast, showDialog,Session, deepMerge, judgeMentEnv } from '@/utils/common'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;
//配置全局取消数组
window.__axiosPromiseArr = [];

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    // "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json"
  },
  timeout: 60000,
})


//常见http错误码列表
const HTTP_ERR_CODE_LIST = {
  [400]: "请求错误",
  [401]: "未授权，请登录",
  [403]: "拒绝访问",
  [404]: "请求地址出错",
  [408]: "请求超时",
  [500]: "服务器内部错误",
  [501]: "服务未实现",
  [502]: "网关错误",
  [503]: "服务不可用",
  [504]: "网关超时",
  [505]: "HTTP版本不受支持"
}

//业务接口错误码列表
const API_ERR_CODE_LIST = {
  [404]: "接口未定义",
  [405]: "登录已失效，请重新登录！",
}

//多请求同时进行时的全局loading配置
const INTERVAL = 400;
let requestCount = 0;

function showLoading (title) {
  if (requestCount === 0) {
    showToast({
      type: 'loading',
      duration: 0,
      // loadingType: 'spinner',
      message: title || "加载中..."
    });
  }
  requestCount++;
}

function hideLoading () {
  if (requestCount <= 0) return;
  requestCount--;
  if (requestCount === 0) {
    //合并一定间隔时间内请求的 loading
    _.debounce(() => { hideToast() }, INTERVAL)()
  }
}

instance.interceptors.request.use(config => {
  // console.log(config)
  if (config.loading && config.loading.show) showLoading(config.loading.text);

  if (config.cancelRepeat) {
    //取消同时发起的多次请求
    if (promiseArr[config.url]) {
      // 二次
      promiseArr[config.url]('操作取消')
      promiseArr[config.url] = cancel
    } else {
      // 首次
      promiseArr[config.url] = cancel
    }
  }
  return config;
}, error => {
  // console.log(error)
  return Promise.reject(error);
});

/* 响应拦截 */
instance.interceptors.response.use(response => {
  if (response.config.loading && response.config.loading.show) hideLoading();

  if (typeof (response.data) == 'string' && response.data != '') {
    response.data = JSON.parse(response.data);
  }

  let res = response.data;

  if (res.status == 404) {
    const errMsg = API_ERR_CODE_LIST[+res.status];
    showToast({
      message: errMsg
    });
    return Promise.reject(errMsg);
  } else if (res.status == 405) {
    //登录失效
    const errMsg = API_ERR_CODE_LIST[+res.status];
    judgeMentEnv(env => {
      showDialog({
        message: res.msg,
        callback (action) {
          if (action === 'confirm') {
            Session.remove(apiTokenKey);
            router.push('/login')
            if (env === 'wx') {
              // location.href = "/wx_oauth?hd_r=" + window.location.href 
              // router.history.current.fullPath
            } else if (env === 'wxmini') {
              // wx.miniProgram.reLaunch({ url: '/pages/login/index'});
            } 
          }
        }
      });
    })
    return Promise.reject(errMsg);
  } else {
    if (response.config.customResponse) {
      return Promise.resolve(res);
    } else {
      if ([1, 9001, 9002].includes(+res.status)) {
        return Promise.resolve(res);
      } else {
        const errMsg = res.msg || '请求失败';
        showToast({
          message: errMsg
        });
        return Promise.reject(errMsg);
      }
    }
  }
}, error => {
  // console.log(error)
  if (error && error.response) {

    if (error.response.config.loading && error.response.config.loading.show) hideLoading();

    const errCode = +error.response.status //错误码
    const errMsg = HTTP_ERR_CODE_LIST[errCode] //错误消息

    error.message = errMsg

    showToast({
      message: error.message || '请求异常'
    });
    console.log('请求出错状态', { errCode, errMsg })
  }
  return Promise.reject(error) // 返回接口返回的错误信息
});


/** 
 * @param    {String}   url                 [请求地址]
 * @param    {Object}   data                [请求数据]
 * @param    {Object}   opt                 [请求配置信息] 自定义添加配置项
 * @param    {Boolean}  opt.customResponse  [自定义处理返回值，默认统一处理]
 * @param    {Boolean}  opt.cancelRepeat    [是否取消同时执行的多次请求，取消多次true、允许多次false]
 * @param    {Boolean}  opt.useCrypto       [是否加密]
 * @return   {[type]}                       [http实例]
 */

const REQUEST_API = (url = '', data = {}, opt = {}) => {
  const DEFAULT_CONFIG_OPTIONS = {
    method: 'GET',
    loading: {
      show: true,
      text: '加载中...'
    },
    customResponse: false,
    cancelRepeat: true,
    useCrypto: false,
    useUpload: false,
  }

  const ts = Date.parse(new Date()) / 1000;
  const options = deepMerge(DEFAULT_CONFIG_OPTIONS, opt);
  const datas = {p:'w',...data};
  // const datas = { ...data, ...options.useCrypto && { _sign: encryption(`${ts}-${ts}`) } }

  return new Promise((resolve, reject) => {

    if (!!options.useUpload) {
      const method = options.method && options.method.toLowerCase() || "post";

      /**
       * @description  文件上传
       */
      const EXTRA_CONFIG = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }

      const config = deepMerge(EXTRA_CONFIG, options);

      const formdata = new FormData();
      Object.keys(datas).forEach(key => {
        if (Array.isArray(datas[key]) && datas[key].length) {
          datas[key].forEach(item => {
            formdata.append(`${key}[]`, item);
          })
        } else {
          formdata.append(key, datas[key])
        }
      })

      instance[method](url, formdata, config)
        .then(res => {
          resolve(res);
          return false;
        })
        .catch(err => {
          reject(err);
        });

    } else {
      /**
       * @description  常用http请求
       */
      options.method = options.method && options.method.toUpperCase() || "GET";

      const config = {
        url,
        ...(
          options.method === "GET" ? { params: datas } :
          (options.method === "POST" ||
            options.method === "PUT" ||
            options.method === "DELETE") ? { data: qs.stringify(datas) } :
          null
        ),
        ...options,
        cancelToken: new CancelToken(c => {
          cancel = c;
          window.__axiosPromiseArr.push({ cancel });
        }),
      };
      instance(config)
        .then(res => {
          resolve(res);
          return false;
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};

export default REQUEST_API;
