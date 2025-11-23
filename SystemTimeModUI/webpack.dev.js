const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/dev.tsx",
  devtool: "inline-source-map",
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          "style-loader", // Для dev используем style-loader вместо MiniCssExtractPlugin
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: (resourcePath) => !resourcePath.endsWith('index.scss'),
                exportLocalsConvention: "camelCase",
                localIdentName: "[local]_[hash:base64:3]",
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules", path.join(__dirname, "src")],
    alias: {
      "mod.json": path.resolve(__dirname, "mod.json"),
      // Моки для CS2 API в dev режиме
      "cs2/api": path.resolve(__dirname, "src/mocks/cs2-api-mock.ts"),
      "cs2/modding": path.resolve(__dirname, "src/mocks/cs2-api-mock.ts"),
      "cohtml/cohtml": path.resolve(__dirname, "src/mocks/cs2-api-mock.ts"),
    },
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      title: "SystemTimeMod - Development",
    }),
  ],
  
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
