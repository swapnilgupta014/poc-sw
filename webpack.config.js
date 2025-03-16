const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/[name].js?v=[chunkhash]",
    chunkFilename: "assets/js/chunks/[name].[contenthash].js",
    hashDigestLength: 6,
    publicPath: "./"
  },
  devServer: {
    historyApiFallback: true,
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
  optimization: {
    splitChunks: {
      chunks: "all", // Changed to 'all' to cache all chunks including initial ones
      minSize: 30000,
      maxSize: 500000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 10,
        },
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: "three",
          chunks: "all",
          priority: 20,
        },
        chartjs: {
          test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
          name: "chartjs",
          chunks: "all",
          priority: 15,
        },
        d3: {
          test: /[\\/]node_modules[\\/]d3[\\/]/,
          name: "d3",
          chunks: "all",
          priority: 15,
        },
        firebase: {
          test: /[\\/]node_modules[\\/]firebase[\\/]/,
          name: "firebase",
          chunks: "all",
          priority: 15,
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: "lodash",
          chunks: "all",
          priority: 15,
        },
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: "framer-motion",
          chunks: "all",
          priority: 15,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ["console.info", "console.debug"],
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                  targets: "> 0.25%, not dead",
                },
              ],
              "@babel/preset-react",
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 1000000000,
      
      exclude: [
        /\.map$/,
        /manifest\.json$/,
        /\.htaccess$/,
      ],
      
      include: [
        /\.js$/,
        /\.css$/,
        /\.html$/,
        /\.png$/,
        /\.jpg$/,
        /\.jpeg$/,
        /\.svg$/,
        /\.gif$/,
        /\.webp$/,
        /\.ico$/,
        /\.woff$/,
        /\.woff2$/,
        /\.ttf$/,
        /\.eot$/,
      ],
    }),
  ],
};