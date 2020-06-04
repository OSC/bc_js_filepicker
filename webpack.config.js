const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: path.join(__dirname, '/src/main.js'),
  output: {
    path: path.resolve(__dirname),
    filename: 'form.js'
  },
  module: {
    rules: [
      { test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader']},
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
};