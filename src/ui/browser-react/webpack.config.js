'use strict';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const os = require('os');

// Plug-ins
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const WebpackBar = require('webpackbar');

// App Info
const appTile = "Web App QuickStart";

// Version
const packagejson = require('./package.json');
const version = JSON.stringify(packagejson.version);
console.log(`application version: ${version}`);

const getPath = (paths, folder, fileOrPath) => {
  return path.resolve(paths[folder], fileOrPath);
};

const tryParseBoolean = (argv, name) => {
  const val = argv.env[name];
  return Boolean(val && JSON.parse(val));
};

const isWindows = () => {
  return os.platform() === 'win32';
};

const getPaths = (argv) => {
  const isProd = (argv.mode === 'production');
  const isWatch = tryParseBoolean(argv, 'WEBPACK_WATCH');
  const targetBuildPath = ((isWatch) ? '../../server/public' : './build');

  console.log(`argv: ${JSON.stringify(argv)}, path:=${targetBuildPath}]`);

  let paths = Object.create({ 'base': __dirname });
  paths.build = path.resolve(paths.base, `${targetBuildPath}`);
  paths.buildjs = path.resolve(paths.base, (paths.build + '/js'));
  paths.src = path.resolve(paths.base, 'src/ts');
  paths.entryPoint = getPath(paths, 'src', 'index.tsx');
  paths.public = (paths.src + '/views/static');

  return paths;
};

const getConfig = (isProd) => {
  let paths = getPaths(isProd);

  let wpConfigDev = {
    name: 'development',
    mode: 'development',
    target: ['browserslist'],
    bail: false,
    entry: {
      main: paths.entryPoint
    },
    output: {
      path: paths.buildjs,
      filename: 'bundle.[name].[chunkhash:8].js',
      chunkFilename: 'bundle.chunk.[chunkhash:8].js',
      publicPath: '/js/',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1500,
      ignored: /node_modules/,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use:
            'ts-loader'
        },
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" }]
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: "url-loader?name=[name].[ext]"
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', 'jsx', '.css'],
      fallback: {
        'stream': require.resolve('stream-browserify'),
        'process': require.resolve('process/browser')
      }
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        APP_VERSION: version,
        BUILD_MACHINE: JSON.stringify(process.env['COMPUTERNAME']),
        BUILD_PLATFORM: process.platform
      }),
      new DuplicatePackageCheckerPlugin(),

      // https://github.com/jantimon/html-webpack-plugin#options
      new HtmlWebpackPlugin({
        filename: path.resolve(paths.build, 'index.html'),
        template: path.resolve(paths.public, 'index-template.html'),
        title: (appTile + ' v.' + packagejson.version),
        publicPath: './js/',
        hash: true
      }),

      // https://webpack.js.org/blog/2020-10-10-webpack-5-release/ (See 'Automatic polyfills for native Node.js modules were removed')
      // https://github.com/webpack/node-libs-browser
      // https://github.com/vercel/next.js/pull/15499/commits/dc68892825306cb94753981ada6fd7d26cae4838
      new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
      new webpack.ProvidePlugin({ process: ['process'] }),
      new webpack.ProvidePlugin({ Stream: ['stream-browserify'] })
    ],
    watchOptions: {
      poll: 1000
    }
  };

  let wpConfigProd = {
    name: 'production',
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          // https://github.com/terser/terser#minify-options
          terserOptions: {
            ecma: 2015,
            sourceMap: true,
            keep_fnames: false,
            keep_classnames: false,
            toplevel: true,
          },
        })
      ]
    },
    module: {
      rules: [
        {
          include: path.resolve('node_modules', 'lodash'),
          sideEffects: false
        },
        {
          include: path.resolve('node_modules', 'moment'),
          sideEffects: false
        }
      ]
    },
    devtool: 'source-map'
  };

  return ((isProd) ? merge(wpConfigDev, wpConfigProd) : wpConfigDev);
};

module.exports = (_, argv) => {
  const config = getConfig(argv);

  if (isWindows()) {
    config.plugins.push(new WebpackBar());
  }

  if (tryParseBoolean(argv, 'analyze')) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  if (tryParseBoolean(argv, 'analyze')) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  if (tryParseBoolean(argv, 'print')) {
    console.info(JSON.stringify(config));
  }

  return config;
};
