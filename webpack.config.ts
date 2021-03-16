import path from "path";

import LoadablePlugin from "@loadable/webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { glob } from "glob";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
  Configuration,
  HotModuleReplacementPlugin,
  optimize,
  WebpackPluginInstance,
} from "webpack";
import nodeExternals from "webpack-node-externals";

import CompilerName from "./src/server/middlewares/render/CompilerName";

const development = process.env.NODE_ENV === "development";
const mode = development ? "development" : "production";

const filterBoolean = <T>(item: T | false): item is T => Boolean(item);

const hydrate = glob
  .sync("src/**/*.hydrate.tsx", { nodir: true })
  .map((file) => path.resolve(__dirname, file));

const css = glob
  .sync("src/**/*.css", { nodir: true })
  .map((file) => path.resolve(__dirname, file));

const config: Configuration[] = [
  {
    devtool: "source-map",
    entry: [
      development && "webpack-hot-middleware/client",
      ...hydrate,
      ...css,
    ].filter(filterBoolean),
    mode,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: [development && "react-refresh/babel"].filter(
                  filterBoolean
                ),
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      browserslistEnv: "browser",
                      corejs: {
                        proposals: true,
                        version: "3.9.1",
                      },
                      modules: false,
                      useBuiltIns: "usage",
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
            },
          ],
        },
      ],
    },
    name: CompilerName.client,
    optimization: {
      minimizer: [
        "...",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "build/client"),
      publicPath: "/",
    },
    plugins: [
      development && new HotModuleReplacementPlugin(),
      new LoadablePlugin() as WebpackPluginInstance,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new MiniCssExtractPlugin(),
      development &&
        new ReactRefreshWebpackPlugin({
          overlay: {
            sockIntegration: "whm",
          },
        }),
    ].filter(filterBoolean),
    resolve: {
      extensions: [".tsx", ".ts", ".mjs", ".js"],
    },
    target: "web",
  },
  {
    devtool: "inline-source-map",
    entry: path.resolve(__dirname, "src/server/middlewares/render/index.tsx"),
    externals: [!development && nodeExternals()].filter(filterBoolean),
    externalsPresets: { node: true },
    mode,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true,
                  exportOnlyLocals: true,
                },
              },
            },
          ],
        },
      ],
    },
    name: CompilerName.server,
    output: {
      filename: "middlewares/render.js",
      libraryTarget: "commonjs2",
      path: path.resolve(__dirname, "build/server"),
    },
    plugins: [
      new optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".mjs", ".js"],
    },
    target: "node",
  },
];

export default config;
