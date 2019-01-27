const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/render/index.tsx',
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist/render'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        use: ['awesome-typescript-loader']
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template/index.html'
    }),
    new CleanWebpackPlugin(['./dist/render/*'])
  ],
  devServer: {
    historyApiFallback: true,
    port: 8081,
    proxy: {
      '/api': 'http://localhost:8080'
    }    
  }
};
