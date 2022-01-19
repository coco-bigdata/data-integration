'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//生成可修改的配置文件
var GenerateAssetPlugin = require('generate-asset-webpack-plugin');
var createServerConfig = function(compilation) {
  let configJson = {
    prod: {
      baseUrl: "http://cloud.vincenthsing.top:8080/cloud/api",
      ssoUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-common-sso-provider', //登录模块
      systemUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-portal-system-management-provider', //系统管理模块
      groupUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-common-group-provider', //分组管理
      projectUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-common-project-provider', //项目管理模块
      runManagerUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-de-run-management-provider', //运行管理模块
      modelMangerUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-portal-model-management-provider', //模型管理模块
      wsUrl: 'ws://prime.shuzhaninfo.com:8088/cloud/ws/dp-di-run-management-provider', //websocket连接地址
      onLineUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-schedule-online-audit-provider', //上线管理模块
      fileUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-file-management-provider',
      recordUrl: 'http://cloud.vincenthsing.top:8080/cloud/api/dp-portal-model-management-provider/superset/forward', //报表跳转
      boardUrl : "http://cloud.vincenthsing.top:8080/de-report-dev/#/newReport",
    },
    test: {
      baseUrl: "http://prime.shuzhaninfo.com:8088/cloud-dev/api",
      ssoUrl: 'http://10.242.10.173:10200/api/dp-common-sso-provider', //登录模块
      systemUrl: 'http://10.242.10.173:10200/api/dp-portal-system-management-provider', //系统管理模块
      groupUrl: 'http://10.242.10.173:10200/api/dp-common-group-provider', //分组管理
      projectUrl: 'http://10.242.10.173:10200/api/dp-common-project-provider', //项目管理模块
      runManagerUrl: 'http://10.242.10.173:10200/api/dp-di-run-management-provider', //运行管理模块
      modelMangerUrl: 'http://10.242.10.173:10200/api/dp-portal-model-management-provider', //模型管理模块
      wsUrl: 'ws://prime.shuzhaninfo.com:8088/cloud-dev/ws/dp-di-run-management-provider', //websocket连接地址
      onLineUrl: 'http://10.242.10.173:10200/api/dp-schedule-online-audit-provider', //上线管理模块
      fileUrl: 'http://10.242.10.173:10200/api/dp-file-management-provider',
      recordUrl: 'http://10.242.10.173:10200/api/dp-portal-model-management-provider/superset/forward', //报表跳转
      boardUrl :"http://prime.shuzhaninfo.com:8088/de-report-dev/#/newReport",
    },
    uat: {
      baseUrl: "http://prime.shuzhaninfo.com:8088/cloud-uat/api",
      ssoUrl: 'http://10.242.10.173:10200/api/dp-common-sso-provider', //登录模块
      systemUrl: 'http://10.242.10.173:10200/api/dp-portal-system-management-provider', //系统管理模块
      groupUrl: 'http://10.242.10.173:10200/api/dp-common-group-provider', //分组管理
      projectUrl: 'http://10.242.10.173:10200/api/dp-common-project-provider', //项目管理模块
      runManagerUrl: 'http://10.242.10.173:10200/api/dp-de-run-management-provider', //运行管理模块
      modelMangerUrl: 'http://10.242.10.173:10200/api/dp-portal-model-management-provider', //模型管理模块
      wsUrl: 'ws://prime.shuzhaninfo.com:8088/cloud-uat/ws/dp-di-run-management-provider', //websocket连接地址
      onLineUrl: 'http://10.242.10.173:10200/api/dp-schedule-online-audit-provider', //上线管理模块
      fileUrl: 'http://10.242.10.173:10200/api/dp-file-management-provider',
      recordUrl: 'http://10.242.10.173:10200/api/dp-portal-model-management-provider/superset/forward', //报表跳转
      boardUrl :"http://prime.shuzhaninfo.com:8088/de-report-dev/#/newReport",
    }

  };
  return JSON.stringify(configJson);
}

// const env = require('../config/prod.env')
const env = require('../config/' + process.env.env_config + '.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.env_config': JSON.stringify(process.env.env_config)
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? {
        safe: true,
        map: {
          inline: false
        }
      } : {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


webpackConfig.plugins.push(
  new GenerateAssetPlugin({
    filename: 'config.json',
    fn: (compilation, cb) => {
      cb(null, createServerConfig(compilation));
    },
    extraFiles: []
  })
)
module.exports = webpackConfig