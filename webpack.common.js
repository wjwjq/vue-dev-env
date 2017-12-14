const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //在每次build之前，清空dist目录及其子目录
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const APP_FILE = path.resolve(APP_PATH, 'app.js');
const BUILD_PATH = path.join(__dirname, 'dist');

const COMPONENTS_PATH = path.resolve(APP_PATH, 'components');
const VIEWS_PATH = path.resolve(APP_PATH, 'views');
const STORE_PATH = path.resolve(APP_PATH, 'store');
const UTILS_PATH = path.resolve(APP_PATH, 'lib/utils');
const API_PATH = path.resolve(APP_PATH, 'lib/api');
const IMAGES_PATH = path.resolve(APP_PATH, 'assets/images');
const STYLES_PATH = path.resolve(APP_PATH, 'assets/styles');

module.exports = {
  //页面入口文件配置
  entry: {
    commons: [
      'vue',
      'vue-router',
      'vuex'
    ],
    app: [
      APP_FILE
    ]
  },
  //入口文件输出配置
  output: {
    publicPath: '/', //编译好的文件，在服务器的路径,这是静态资源引用路径
    path: BUILD_PATH, //发布文件地址
    filename: '[name].[hash].js', //编译后的文件名字
    chunkFilename: '[name].[hash].js'
  },
  //配置文件模块解析
  module: {
    rules: [{
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            extractCSS: true,
            postLoaders: {
              html: 'babel-loader'
            }
          }
        }]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [APP_PATH],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: process.env.NODE_ENV === 'production' ?
          ExtractTextPlugin.extract({
            fallback: 'style-loader/url',
            use: [{
              loader: 'css-loader',
              options: {
                sourceMap: false,
                modules: false, // css modules
                importLoaders: 1,
                localIdentName: '[local]-[hash:base64:8]'
              }
            }, 'postcss-loader'],
            publicPath: 'dist'
          }) : ['style-loader', {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              importLoaders: 1,
              localIdentName: '[local]-[hash:base64:8]'
            }
          }, 'postcss-loader'],
        include: [APP_PATH]
      },
      {
        test: /\.less$/,
        use: process.env.NODE_ENV === 'production' ?
          ExtractTextPlugin.extract({
            fallback: 'style-loader/url',
            use: [{
              loader: 'css-loader',
              options: {
                sourceMap: false, //生成样式表link,添加到html head中
                modules: false, // css modules
                importLoaders: 1,
                localIdentName: '[local]-[hash:base64:8]'
              }
            }, 'postcss-loader', 'less-loader'],
            publicPath: 'dist'
          }) : ['style-loader', {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              importLoaders: 1,
              localIdentName: '[local]-[hash:base64:8]'
            }
          }, 'postcss-loader', 'less-loader'],
        include: [APP_PATH]
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
        include: [APP_PATH]
      }
    ]
  },

  //引入第三方类库
  externals: {
    //"jquery": "jQuery"
  },

  resolve: {
    alias: { // 配置目录别名
      'vue$': 'vue/dist/vue.esm.js',
      components: COMPONENTS_PATH,
      views: VIEWS_PATH,
      store: STORE_PATH,
      utils: UTILS_PATH,
      api: API_PATH,
      styles: STYLES_PATH,
      images: IMAGES_PATH
    },
    // 引用js、vue、less、css文件可以省略后缀名
    extensions: ['.js', '.vue', '.less', '.css']
  },

  target: 'web',

  //插件
  plugins: [
    new webpack.ProvidePlugin({
      'vue': 'vue',
      'vue-router': 'vue-router',
      'vuex': 'vuex'
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: Infinity
    })
  ]
};