"use strict";

const webpack = require("webpack"),
    path = require("path"),
    fsx = require("fs-extra");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const config = require("config");

const BUILD_DIR = path.resolve(__dirname, "../public/dist/");
const APP_DIR = path.resolve(__dirname, "../public/");
const CLIENT_CONFIG = path
    .resolve(__dirname, "../public/")
    .concat("/client.json");

fsx.writeFileSync(
    path.resolve(CLIENT_CONFIG),
    JSON.stringify(config.get("client"))
);

module.exports = {
    mode: "development",
    entry: {
        app: [
            "webpack-dev-server/client?http://localhost:8080",

            // Hot reload only when compiled successfully
            "webpack/hot/only-dev-server",
            "react-hot-loader/patch",
            APP_DIR + "/index.jsx",
        ],
    },

    output: {
        path: BUILD_DIR,
        filename: "bundle.js",
        publicPath: "/",
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: APP_DIR,
                exclude: [BUILD_DIR],
                use: [
                    {
                        loader: "react-hot-loader/webpack",
                    },
                    {
                        loader: "babel-loader",
                        query: {
                            presets: ["@babel/preset-react"],
                            plugins: [
                                "@babel/plugin-proposal-class-properties",
                                "@babel/plugin-proposal-object-rest-spread",
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(scss|css)$/,
                loaders: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                ],
            },
        ],
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: APP_DIR + "/views/index.html",
            filename: "./index.html",
        }),
    ],

    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            config: CLIENT_CONFIG,
            "react-dom": "@hot-loader/react-dom",
        },
    },

    devtool: "source-map",
    devServer: {
        contentBase: APP_DIR,
        hot: true,
        port: 8090,
    },
};
