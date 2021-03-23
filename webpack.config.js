const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {
  const NODE_ENV = env.NODE_ENV == undefined ? 'development' : env.NODE_ENV; 
  const ASSET_PATH = NODE_ENV == 'production' ? 'http://www.chavasan.tk/' : '/';
  const BASE_PATH = NODE_ENV == 'production' ? '' : '/';
  return ({
    entry: './src/App.jsx',
    output: {
      path: `${__dirname}/dist/`,
      publicPath: ASSET_PATH,
      filename: '[name].bundle.js',
    },
    mode: NODE_ENV,
    devServer: {
      contentBase: 'dist/',
      port: 7000,
      hot: true,
      historyApiFallback: true,
    },
    devtool: 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {'crypto': false}
    },
    optimization: {
      splitChunks: {
       chunks: 'all',
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                '@babel/preset-env'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ],              
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true
              }
            }
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts',
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React App',
        template: 'index.html'
      }),
      new webpack.DefinePlugin({
        'BASE_PATH': JSON.stringify(BASE_PATH),
      }),
      new CopyPlugin({
        patterns: [
          { from: '.htaccess', to: '' },
        ],
      }),
    ]
  })
};
