import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import * as path from "path";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const iconDir = path.join(__dirname, "src", "assets", "icons");

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        icon: path.join(iconDir, "AppIcon"),
        // appBundleId: "world.waldens.langtrainer",
        // osxSign: {},
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            iconUrl: path.join(iconDir, "AppIcon.ico"),
            setupIcon: path.join(iconDir, "AppIcon.ico"),
        }),
        new MakerZIP({}, ["darwin"]),
        new MakerRpm({}),
        new MakerDeb({
            options: {
                icon: path.join(iconDir, "AppIcon.png"),
            },
        }),
    ],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: "./src/index.html",
                        js: "./src/renderer.ts",
                        name: "main_window",
                        preload: {
                            js: "./src/preload.ts",
                        },
                    },
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "B0sh",
                    name: "language-ai-trainer",
                },
                prerelease: false,
                draft: true,
            },
        },
    ],
};

export default config;
