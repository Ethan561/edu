/*
 * @Author: liuyi
 * @Date: 2022-06-10 23:32:54
 * @LastEditors: liuyi
 * @LastEditTime: 2023-06-10 10:17:39
 * @FilePath: \questionnaire-template-master\vue.config.js
 * @Description: 
 */
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const Timestamp = new Date().getTime();

module.exports = {
  // productionSourceMap: !IS_PROD, // 生产环境的 source map,
  productionSourceMap: true, // 生产环境的 source map,
  filenameHashing: true,
  /* 是否使用包含运行时编译器的 Vue 构建版本 */
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('assets', '@/assets')
      .set('components', '@/components')
      .set('views', '@/views')
      .set('router', '@/router')
      .set('utils', '@/utils')
    // 修复HMR
    config.resolve.symlinks(true);
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.output.filename = `js/[name].${Timestamp}.js`;
      config.output.chunkFilename = `js/[name].${Timestamp}.js`;
    }
  },

  /* 关闭开发时的eslint检验 */
  lintOnSave: false,
  /* 是否为 Babel 或 TypeScript 使用 thread-loader。
  该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。 */
  parallel: require('os').cpus().length > 1,
  /* 移动端适配插件 */
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            unitToConvert: "px",
            viewportWidth: 375,
            minPixelValue: 1,
            unitPrecision: 3,
            propList: ["*"],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: ['.ignore'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: /(\/|\\)(node_modules)(\/|\\)/,
          })
        ]
      }
    },
    extract: {
      filename: `css/[name].${Timestamp}.css`,
      chunkFilename: `css/[name].${Timestamp}.css`,
    },
  },
  devServer: {
    open: false,
    port: 8088,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        // target: 'http://182.92.81.25:8080',
        target: 'http://zljc.zhaokao.net',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  outputDir: 'question_mobile',
  publicPath: './'
}