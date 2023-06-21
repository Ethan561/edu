import { Toast, Dialog } from 'vant'
import wx from 'weixin-js-sdk';
import crypto from "crypto";
/**
 * @通用提示
 */
export const showToast = options => {
  const DEFAULT = { type: "text", forbidClick: true, duration: 1500 };
  Toast({ ...DEFAULT, ...options });
}

export const hideToast = () => {
  Toast.clear();
}

export const showDialog = options => {
  const DEFAULT = { title: "提示", closeOnPopstate: true, showCancelButton: false, confirmButtonColor: '#cc974c' };
  Dialog({ ...DEFAULT, ...options });
}
/**
 * 生成设备唯一码，要求MD5加密
 */
export const generateUUID = () => {
  let md5 = crypto.createHash("md5");
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  md5.update(uuid);
  return md5.digest("hex");
}
/**
 * @alias 封装js存储
 */
const ls = window.localStorage
const ss = window.sessionStorage

export const Cookie = {
  set(name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  },
  get(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  },
  remove(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = this.get(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
export const Local = {
  // 判断浏览器是否支持LocalStorage
  hasLocalStorage: function () {
    return window.Storage && window.localStorage && window.localStorage instanceof Storage
  },
  get(key) {
    if (this.hasLocalStorage()) {
      if (key) return JSON.parse(ls.getItem(key))
      return null
    } else {
      return Cookies.get(key)
    }
  },
  set(key, val, day) {
    if (this.hasLocalStorage()) {
      const setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (const i in setting) {
          ls.setItem(i, JSON.stringify(setting[i]))
        }
      } else {
        ls.setItem(key, JSON.stringify(val))
      }
    } else {
      Cookies.set(key, val, day)
    }
  },
  remove(key) {
    if (this.hasLocalStorage()) {
      ls.removeItem(key)
    } else {
      Cookies.remove(key)
    }
  },
  clear() {
    ls.clear()
  }
}

export const Session = {
  get(key) {
    if (key) return JSON.parse(ss.getItem(key))
    return null
  },
  set(key, val) {
    const setting = arguments[0]
    if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
      for (const i in setting) {
        ss.setItem(i, JSON.stringify(setting[i]))
      }
    } else {
      ss.setItem(key, JSON.stringify(val))
    }
  },
  remove(key) {
    ss.removeItem(key)
  },
  clear() {
    ss.clear()
  }
}

/**
 * @alias 日期格式化，24小时制
 */
export function datefmt(time = new Date(), fmt = 'YYYY-MM-DD hh:mm:ss') {
  const date = typeof time === 'string' ? new Date(time) : time
  const weekdays = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d']
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds(),
    'w+': date.getDay()
  }
  if (/(Y+)/i.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k)) {
      if (k === 'w+') {
        fmt = fmt.replace('w', '\u5468' + weekdays[o[k]]) // 周
      } else if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1
          ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
  }
  return fmt
}
/**
 * @根据当前跳转的路由设置显示在浏览器标签的title
 * @param {object} route 路由对象
 */
export const getRouteTitleHandled = (route) => {
  const router = { ...route }
  const meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else {
      title = meta.title
    }
  }
  meta.title = title
  router.meta = meta
  return router
}
/**
 * 
 * @param {object} item 提示对象
 * @param {this} vm 
 * @returns 提示内容
 */
export const showTitle = (item, vm) => {
  let { title } = item.meta
  if (!title) return
  title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @根据当前跳转的路由设置显示在浏览器标签的title
 * @param {object} routeItem 路由对象
 * @param {string} title     APP title
 * @param {object} vm Vue实例
 */
export const setTitle = (routeItem, title) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  return resTitle
}

/**
 * 获取文件后缀名
 * @param {object} file
 */
export const getFileSuffix = file => {
  const fileName = file.name
  const suffix = fileName.substring(fileName.lastIndexOf('.') + 1)
  return suffix
}

/**
 * 下划线转换驼峰
 * @param    {string}   name []
 */
export const toHump = name => {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转换下划线
 * @param    {string}   name []
 */
export const toLine = name => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 转成驼峰或者下划线
 * @param    {object}   obj  []
 * @param    {number}   type [1驼峰，2下划线]
 */
export const fmtObjKey = (obj, type = 1) => {
  const newObj = {}
  for (const [key, value] of Object.entries(obj)) {
    const _key = type == 1 ? toHump(key) : toLine(key)
    newObj[_key] = value
  }
  return newObj
}

/**
 * 对象转数组对象
 * @param    {object}   obj  []
 *
 * eg: { i: "Ios", a: "Android" } => [{ key: "i", value: "Ios" }, { a: "i", value: "Android" }]
 */
export const transObjToArr = (obj) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }))
}

/**
 * 数据类型判断
 * @param {object} obj
 */
export const typeOf = obj => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * 深度比较两个对象是否相同
 * @param {object} oldData
 * @param {object} newData
 */
export const equalsObj = (oldData, newData) => {
  if (oldData === newData) return true
  if (typeOf(oldData) === 'object' && typeOf(newData) === 'object' && Object.keys(oldData).length === Object.keys(newData).length) {
    for (const key in oldData) {
      if (Object.prototype.hasOwnProperty.call(oldData, key)) {
        if (!equalsObj(oldData[key], newData[key])) { return false }
      }
    }
  } else if (typeOf(oldData) === 'array' && typeOf(oldData) === 'array' && oldData.length === newData.length) {
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i])) { return false }
    }
  } else {
    return false
  }
  return true
}

/**
 * 深度merge
 * @param {object} target
 * @param {object} source
 */
export const deepMerge = (target, source) => {
  let key
  for (key in source) {
    target[key] =
      target[key] && target[key].toString() === '[object Object]'
        ? deepMerge(target[key], source[key])
        : (target[key] = source[key])
  }
  return target
}

/**
 * 深度clone
 * @param {object} source
 */
export const deepClone = source => {
  const targetObj = source.constructor === Array ? [] : {} // 判断复制的目标是数组还是对象
  for (const keys in source) {
    if (Object.prototype.hasOwnProperty.call(source, keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/**
 * 节流
 * @param {function} fn [方法名]
 * @param {number}   t  [延迟时间]
 */
export const throttle = (fn, t = 1000) => {
  if (typeof fn !== 'function') throw new Error('第一个参数必须是方法')
  const _fn = fn
  let time = null
  let first = true
  return function () {
    const arg = arguments
    const _this = this
    if (first) {
      _fn.apply(_this, arg)
      first = false
      return
    }
    if (time) return
    time = setTimeout(function () {
      setTimeout(time)
      time = null
      _fn.apply(_this, arg)
    }, t)
  }
}

/**
 * 防抖
 * @param    {function}  fn []
 * @param    {number}    t  []
 * @param    {boolean}   immediate  []
 */
export const debounce = (fn, t = 1000, immediate = true) => {
  if (typeof fn !== 'function') throw new Error('第一个参数必须是方法')
  const _fn = fn
  let timer
  return function () {
    if (timer) clearTimeout(timer)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, t)
      if (callNow) {
        _fn.apply(this, arguments)
      }
    } else {
      timer = setTimeout(() => {
        _fn.apply(this, arguments)
      }, t)
    }
  }
}

/**
 * 多维数组扁平化处理
 * @param {array} arr
 */
export const flatten = arr => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

/**
 * @解决事件监听兼容性问题
 * @param {object} obj对象
 * @param {string} type时间类型,不带'on'前缀
 * @param {function} callback事件处理程序
 */
export const addEvent = (element, type, handler) => {
  if (element.addEventListener) {
    // W3C内核
    element.addEventListener(type, handler, false)
  } else if (element.attachEvent) {
    // IE内核
    element.attachEvent('on' + type, handler)
  } else {
    element['on' + type] = handler
  }
}

/**
 * 解决移除事件监听兼容性问题
 * @param {object} obj对象
 * @param {string} type时间类型,不带'on'前缀
 * @param {function} callback事件处理程序
 */
export const removeEvent = (element, type, handler) => {
  if (element.removeEventListener) {
    // W3C内核
    element.removeEventListener(type, handler)
  } else {
    // IE内核
    element.detachEvent('on' + type, handler)
  }
}

/**
 * 时间加时长转时间段
 */
export const timeAddTimeLengthToTimeinterval = (time, timeLength) => {
  if (!time) {
    return null
  }
  const hours = timeLength < 60 ? 0 : Math.floor(timeLength / 60)
  const minutes = timeLength % 60
  let newHourse = +time.split(':')[0] + hours
  let newMinutes = +time.split(':')[1] + minutes
  if (newMinutes >= 60) {
    newMinutes = 0
    newHourse++
  }
  const newTime = (newHourse >= 10 ? newHourse : ('0' + newHourse)) + ':' + (newMinutes >= 10 ? newMinutes : ('0' + newMinutes))
  const timeinterval = time + '-' + newTime
  return timeinterval
}

/**
 * 
 * @param {Arrray} arr 
 * @returns 数组和的值
 */
export const arrSum = (arr) => {
  let sum = 0
  if (arr.length) {
    sum = arr.reduce((prev, next) => prev + next)
  }
  return sum
}

/**
 * 数据脱敏
 */
export const desensitization = (val) => {
  if (val && val.length) {
    const len = val.length
    if (len === 1) {
      return '*'
    } else if (len === 2) {
      return val[0] + '*'
    } else if (len === 3) {
      return val[0] + '*' + val[2]
    } else if (len > 3 && len < 6) {
      const newVal = val.substring(1, len - 1)
      const newValChange = []
      for (let i = 0; i < newVal.length; i++) {
        newValChange.push('*')
      }
      return val[0] + newValChange.join('') + val[len - 1]
    } else if (len >= 6 && len < 8) {
      const newVal = val.substring(2, len - 2)
      const newValChange = []
      for (let i = 0; i < newVal.length; i++) {
        newValChange.push('*')
      }
      return val[0] + val[1] + newValChange.join('') + val[len - 2] + val[len - 1]
    } else {
      const newVal = val.substring(3, len - 3)
      const newValChange = []
      for (let i = 0; i < newVal.length; i++) {
        newValChange.push('*')
      }
      return val[0] + val[1] + val[2] + newValChange.join('') + val[len - 3] + val[len - 2] + val[len - 1]
    }
  }
}
/**
 * 验证是否是微信环境
 */
export const checkWx = () => {
  let browser = {
    versions: (function () {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1, //IE内核
        presto: u.indexOf("Presto") > -1, //opera内核
        webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
        iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf("iPad") > -1, //是否iPad
        webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
      };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  };
  if (browser.versions.mobile) {
    var ua = navigator.userAgent.toLowerCase();
    //在微信中打开
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  }
};
/**
 * 微信环境判断
 * 
 * w-浏览器
 * wx-微信公众号
 * wxmini-小程序
 */
export const judgeMentEnv = (callback = () => { }) => {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    wx.miniProgram.getEnv(function (res) {
      callback && callback(res.miniprogram ? "wxmini" : "wx");
    });
  } else {
    callback && callback("w");
  }
};
/* 判断数组中是否有重复值 */
export const arrHasvalue = (arr) => {
  var nary = arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (nary[i] == nary[i + 1]) {
      // console.log("数组重复内容：" + nary[i]);
      return true;
    } else {
      return false;
    }
  }
}

export const isObjArr = (value) => {
  if (Object.prototype.toString.call(value) === "[object Array]") {
    return 'array'
  } else if (Object.prototype.toString.call(value) === '[object Object]') {
    return 'object'
  } else {
    return ''
  }
}