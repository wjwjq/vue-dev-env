const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin"); //在每次build之前，清空dist目录及其子目录
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //生成index.html

const isProduction = process.env.NODE_ENV === "production";

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, "src");
const APP_FILE = path.resolve(APP_PATH, "app.js");
const BUILD_PATH = path.join(__dirname, "build");
const TEMPLATE_PATH = path.resolve(ROOT_PATH, "index.html");
const COMPONENTS_PATH = path.resolve(APP_PATH, "components");
const VIEWS_PATH = path.resolve(APP_PATH, "views");
const ROUTER_PATH = path.resolve(APP_PATH, "router");
const STORE_PATH = path.resolve(APP_PATH, "store");
const UTILS_PATH = path.resolve(APP_PATH, "lib/utils");
const API_PATH = path.resolve(APP_PATH, "lib/api");
const IMAGES_PATH = path.resolve(APP_PATH, "assets/images"); //图片目录
const STYLES_PATH = path.resolve(APP_PATH, "assets/styles"); //样式目录
const FAVICON_PATH = path.resolve(IMAGES_PATH, "favicon.png"); //favicon目录

const ASSETS_SUB_PATH = "staic";

const PROXY_URI = "http://localhost:3000"; //反向代理地址

const getLocalIPv4 = () => {
  const os = require("os");
  const interfaces = os.networkInterfaces();
  let details;
  for (let key in interfaces) {
    for (let i = 0; i < interfaces[key].length; i++) {
      details = interfaces[key][i];
      if (details.family === "IPv4" && (key === "en0" || key === "eth0" || key === "以太网")) {
        return details.address;
      }
    }
  }
  return "127.0.0.1";
};

const getPort = () => {
  let port = 8080;
  process.argv.forEach((argv, idx, argvs) => {
    if (argv === "--port") {
      port = Number(argvs[idx + 1]) ? argvs[idx + 1] : port;
    }
  });
  return port;
};

const commonConfig = {
  //页面入口文件配置
  entry: {
    commons: [
      "vue",
      "vue-router",
      "vuex"
    ],
    app: [
      APP_FILE
    ]
  },
  //入口文件输出配置
  output: {
    publicPath: "/", //编译好的文件，在服务器的路径,这是静态资源引用路径
    path: BUILD_PATH, //发布文件地址
    filename: "[name].[hash].js", //编译后的文件名字
    chunkFilename: "[name].[hash].js"
  },
  //配置文件模块解析
  module: {
    rules: [{
      enforce: "pre",
      test: /\.vue$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    },
    {
      test: /\.vue$/,
      use: [{
        loader: "vue-loader",
        options: {
           loaders: {
              css: ExtractTextPlugin.extract({
                fallback: "vue-style-loader",
                use: [{
                  loader: "css-loader",
                  options: {
                    sourceMap: false,
                    modules: false, // css modules
                    importLoaders: true,
                    localIdentName: "[name].[hash:5]"
                  }
                }, "postcss-loader"]
              }),
              less: ExtractTextPlugin.extract({
                fallback: "vue-style-loader",
                use: [{
                  loader: "css-loader",
                  options: {
                    sourceMap: false,
                    modules: false, // css modules
                    importLoaders: true,
                    localIdentName: "[name].[hash:5]"
                  }
                }, "postcss-loader", "less-loader"]
              })
           },
          transformToRequire: {
            video: "src",
            source: "src",
            img: "src",
            image: "xlink:href"
          }
        }
      }]
    },
    {
      test: /\.js$/,
      use: ["babel-loader", "eslint-loader"],
      include: [APP_PATH],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: isProduction ?
        ExtractTextPlugin.extract({
          fallback: "style-loader/url",
          use: [{
            loader: "css-loader",
            options: {
              sourceMap: false,
              modules: false, // css modules
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64:8]"
            }
          }, "postcss-loader"]
        }) : ["style-loader", {
          loader: "css-loader",
          options: {
            sourceMap: true,
            modules: false,
            importLoaders: 1,
            localIdentName: "[local]-[hash:base64:8]"
          }
        }, "postcss-loader"]
      // include: [APP_PATH]
    },
    {
      test: /\.less$/,
      use: isProduction ?
        ExtractTextPlugin.extract({
          fallback: "style-loader/url",
          use: [{
            loader: "css-loader",
            options: {
              sourceMap: false, //生成样式表link,添加到html head中
              modules: false, // css modules
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64:8]"
            }
          }, "postcss-loader", "less-loader"]
        }) : ["style-loader", {
          loader: "css-loader",
          options: {
            sourceMap: true,
            modules: false,
            importLoaders: 1,
            localIdentName: "[local]-[hash:base64:8]"
          }
        }, "postcss-loader", "less-loader"]
      // include: [APP_PATH]
    },
    {
      test: /\.(png|jpg|gif|jpeg|svg)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 8192,
          name: `${ASSETS_SUB_PATH}/images/[hash:8].[name].[ext]`
        }
      }],
      exclude: /^node_modules$/
    },
    {
      test: /\.(woff|woff2|eot|ttf)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 100000,
          name: `${ASSETS_SUB_PATH}/fonts/[name].[ext]`
        }
      }]
    },
    {
      test: /\.html$/,
      use: ["html-loader"],
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
      "vue$": "vue/dist/vue.esm.js",
      "@": APP_PATH,
      components: COMPONENTS_PATH,
      router: ROUTER_PATH,
      views: VIEWS_PATH,
      store: STORE_PATH,
      utils: UTILS_PATH,
      api: API_PATH,
      styles: STYLES_PATH,
      images: IMAGES_PATH
    },
    // 引用js、vue、less、css文件可以省略后缀名
    extensions: [".js", ".vue", ".less", ".css"]
  },

  target: "web",

  //插件
  plugins: [
    new webpack.ProvidePlugin({
      "vue": "vue",
      "vue-router": "vue-router",
      "vuex": "vuex"
    }),
    new CleanWebpackPlugin([BUILD_PATH]),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      minChunks: Infinity
    }),
    //生成HTML文件
    new HtmlWebpackPlugin({
      title: "app",
      template: TEMPLATE_PATH,
      chunksSortMode: "dependency",
      favicon: FAVICON_PATH,
      inject: true
    })
  ]
};

module.exports = merge(commonConfig, isProduction ? {
  // devtool: 'source-map',
  output: {
    filename: `${ASSETS_SUB_PATH}/js/${commonConfig.output.filename}`,
    chunkFilename: `${ASSETS_SUB_PATH}/js/[name].[hash].js`
  },
  //插件项
  plugins: [
    //CSS文件单独打包
    new ExtractTextPlugin({
      filename: `${ASSETS_SUB_PATH}/css/style.css`,
      disable: false,
      allChunks: true
    }),
    //文件压缩
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      compress: {
        warnings: false,
        "drop_console": true
      }
    }),
    //加载器最小化
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      context: __dirname,
      debug: false
    }),
    //生成文件顶部加入注释
    new webpack.BannerPlugin({
      banner: "This file is created by eagleagle, " + new Date(),
      raw: false,
      entryOnly: true
    })

  ]
} : {
  devtool: "inline-source-map",
  devServer: {
    proxy: {
      "/api": {
        target: PROXY_URI,
        changeOrigin: true
      }
    },
    host: "0.0.0.0",
    public: `${getLocalIPv4()}:${getPort()}`, //允许其它主机访问
    port: getPort(),
    disableHostCheck: true,
    allowedHosts: [],
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: false,
    open: true,
    watchOptions: {
      poll: true
    }
  },

  //插件项
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
