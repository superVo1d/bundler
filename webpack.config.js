const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    edit: './src/edit.js',
    list: './src/list.js',
    main: './src/main.js',
    people: './src/people.js',
    styles: './src/index.css'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.min.css'
    }),
  ],
};
