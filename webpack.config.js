const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/example/index.js',
  output: {
    path: path.resolve(__dirname, 'example'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      // 处理图片文件
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]', // 输出文件名格式
              outputPath: 'assets/img', // 输出目录
              publicPath: 'assets/img' // 设置生成的图片资源的引用路径
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/img', to: 'assets/img' }
      ],
    }),
  ],
  mode:"development",
  devtool: 'source-map' // 使用 Source Map 选项
};
