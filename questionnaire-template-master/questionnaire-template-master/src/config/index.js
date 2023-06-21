/**
 * [全局配置]
 */

let wxOauthUrl = "";
let devTestToken = "";

if (process.env.NODE_ENV == "development") {
  devTestToken = "";
}
/**
 * @导出配置
 */
module.exports = {
  /**
   * @description 开发模式
   */
  isDebugMode: process.env.NODE_ENV == "development",
  /**
   * @description api请求基础路径
   */
  baseUrl: '/',
  /**
 * @description 验证码请求路径
 */
  baseCptUrl: 'http://113.62.168.7:8080',
  /**
   * @description 服务器端动态cookie前缀
   */
  cookiePrefix: '',
  /**
   * @description 是否是无用户版本 
   */
  isNoUsr: false,
  /**
   * @description 服务器端动态微信授权地址
   */
  wxOauthUrl,
  /**
   * @description 是否使用开发环境测试token
   */
  devTestToken,
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 有用户版时是否需要微信授权登录（不需要则为普通账号密码登录）
   */
  wxAuthRequired: false,
  /**
   * @description 散客动态前缀
   */
  prefix: "person",

  /**
   * @description 散客token键名
   */
  apiTokenKey: "person_api_token"
};
