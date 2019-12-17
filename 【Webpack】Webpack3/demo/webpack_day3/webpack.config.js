const path = require("path");
const CopyrightWebpackPlugin = require("./plugins/copyright-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolveLoader: {
    modules: ["node_modules", "./loader"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "replaceLoader"
          },
          {
            loader: "replaceLoaderAsync",
            options: {
              name: "kkb"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyrightWebpackPlugin({
      name: "开课吧"
    })
  ]
};
