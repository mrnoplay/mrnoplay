const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
process.env.VUE_APP_VER = require('./package.json').version
module.exports = {
	publicPath: './',
    outputDir: 'www',
    productionSourceMap: false,
    configureWebpack: (config) => {
        if (process.env.NODE_ENV == 'production') {
            // 为生产环境修改配置
            config.mode = 'production'
            // 将每个依赖包打包成单独的js文件
            let optimization = {
              minimizer: [new UglifyPlugin({
                  uglifyOptions: {
                      warnings: false,
                      compress: {
                        drop_console: true, 
                        drop_debugger: false,
                        pure_funcs: ['console.log'] 
                      }
                  }
               })]
            }
            let node = {
                __filename: true,
                __dirname: true
            };  
            Object.assign(config, {
              optimization, node
            })
        } else {
            // 为开发环境修改配置
            config.mode = 'development'
            let node = {
                __filename: true,
                __dirname: true
            };  
            Object.assign(config, {
              node
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
    }
}