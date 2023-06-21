/*
 * @Author: liuyi
 * @Date: 2022-06-09 22:40:50
 * @LastEditors: liuyi
 * @LastEditTime: 2023-05-31 16:54:12
 * @FilePath: \questionnaire-pc\vue.config.js
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
      .set("assets", "@/assets")
      .set("components", "@/components")
      .set("views", "@/views")
      .set("router", "@/router")
      .set("utils", "@/utils");
    // 修复HMR
    config.resolve.symlinks(true);
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.output.filename = `js/[name].${Timestamp}.js`;
      config.output.chunkFilename = `js/[name].${Timestamp}.js`;
    }
  },

  css: {
    extract: {
      filename: `css/[name].${Timestamp}.css`,
      chunkFilename: `css/[name].${Timestamp}.css`,
    },
  },

  /* 关闭开发时的eslint检验 */
  lintOnSave: false,
  /* 是否为 Babel 或 TypeScript 使用 thread-loader。
  该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。 */
  parallel: require("os").cpus().length > 1,
  devServer: {
    open: false,
    port: 8088,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      "/api": {
        // target: 'http://182.92.81.25:8080',
        target: "http://zljc.zhaokao.net",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  outputDir: "question_pc",
  publicPath: "./",
};
