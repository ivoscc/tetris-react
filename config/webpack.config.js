const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const BASEDIR = path.join(__dirname, '..')
const TEMPLATE = path.join(BASEDIR, 'public/index.html')


const config = {
  context: BASEDIR,
  entry: {
    app: './src/App.jsx',
    styles: glob.sync('./src/styles/*.css')
  },
  output: {
    path: path.join(BASEDIR,  'dist/'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: TEMPLATE
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  }
}

module.exports = config
