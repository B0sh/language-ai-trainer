import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: "webpack-infrastructure",
    }),
    new CopyPlugin({
        patterns: [
            // Copy Shoelace assets to dist/shoelace
            {
                from: path.resolve(
                    __dirname,
                    "node_modules/@shoelace-style/shoelace/dist/assets"
                ),
                to: path.resolve(
                    __dirname,
                    ".webpack/renderer/dist/shoelace/assets"
                ),
            },
        ],
    }),
];
