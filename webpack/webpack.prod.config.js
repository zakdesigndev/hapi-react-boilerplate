"use strict";

const webpack = require("webpack"),
    path = require("path"),
    fsx = require("fs-extra");

const { CleanWebpackPlugin } = require("clean-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    TerserPlugin = require("terser-webpack-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
    CssNano = require("cssnano");
const config = require("config");

const BUILD_DIR = path.resolve(__dirname, "../public/dist");
const APP_DIR = path.resolve(__dirname, "../public/");
const CLIENT_CONFIG = path
    .resolve(__dirname, "../public/")
    .concat("/client.json");

fsx.writeFileSync(
    path.resolve(CLIENT_CONFIG),
    JSON.stringify(config.get("client"))
);

module.exports = {
    mode: "production",
    entry: [APP_DIR + "/index.jsx"],

    output: {
        path: BUILD_DIR,
        filename: "bundle.js",
        chunkFilename: "vendors.bundle.js",
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|woff|woff2)$/,
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
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    cache: true,
                    parallel: true,
                    ie8: false,
                    warnings: false,
                    output: {
                        comments: false,
                    },
                    ecma: 8,
                    compress: {
                        drop_console: true, // <-
                    },
                },
            }),
        ],
        noEmitOnErrors: true,
        namedModules: false,
        namedChunks: false,
        nodeEnv: "production",
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        occurrenceOrder: true,
        usedExports: true,
        concatenateModules: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    enforce: true,
                },
                // styles: {
                //     name: "styles",
                //     test: /\.s?css$/,
                //     chunks: "all",
                //     minChunks: 1,
                //     reuseExistingChunk: true,
                //     enforce: true,
                //     priority: 1
                // }
            },
        },
    },

    plugins: [
        new webpack.DefinePlugin({
            global: {}, //  webpack workaround
        }),
        new CleanWebpackPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: false,
        }),
        new MiniCssExtractPlugin({
            filename: "styles.min.css",
            chunkFilename: "[name].min.css",
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessor: CssNano,
            cssProcessorPluginOptions: {
                preset: ["default", { discardComments: { removeAll: true } }],
            },
            canPrint: true,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
        }),
    ],

    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            config: CLIENT_CONFIG,
        },
    },

    devtool: "cheap-module-source-map",
};
