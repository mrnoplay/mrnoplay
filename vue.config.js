const path = require('path')
const package = require('./package.json')
const TerserPlugin = require('terser-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
process.env.VUE_APP_VER = package.version
process.env.VUE_APP_BUILD = package.build.number
module.exports = {
  publicPath: './',
  outputDir: 'www',
  productionSourceMap: false,
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        sassOptions: {
          minimize: false
        }
      },
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimize: true,
        minimizer: [new TerserPlugin()],
      };
      let node = {
        __filename: true,
        __dirname: true,
        console: true,
      };
      Object.assign(config, {
        optimization,
        node,
      })
    } else {
      // 为开发环境修改配置
      config.mode = 'development'
      let node = {
        __filename: true,
        __dirname: true
      };
      Object.assign(config, {
        node,
      })
    }
  },
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
}