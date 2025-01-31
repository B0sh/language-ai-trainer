import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import * as path from "path";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";
import PublisherGithub from "@electron-forge/publisher-github";

const iconDir = path.join(__dirname, "src", "assets", "icons");

// 10$/month for azure trusted signing certificate
// https://azure.microsoft.com/en-us/products/trusted-signing

// 100$/year for apple developer account for mac certificate
// https://developer.apple.com/account/resources/

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        icon: path.join(iconDir, "AppIcon"),
        executableName: "language-trainer",
        // appBundleId: "world.waldens.langtrainer",
        // osxSign: {},
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            name: "language-trainer",
            iconUrl: path.join(iconDir, "AppIcon.ico"),
            setupIcon: path.join(iconDir, "AppIcon.ico"),
        }),
        // new MakerZIP({}, ["darwin"]),
        new MakerRpm({}),
        new MakerDeb({
            options: {
                icon: path.join(iconDir, "AppIcon.png"),
            },
        }),
        new MakerDMG({
            name: "language-trainer",
            icon: path.join(iconDir, "AppIcon.icns"),
            format: "ULFO",
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
        new PublisherGithub({
            repository: {
                owner: "B0sh",
                name: "language-trainer",
            },
            prerelease: false,
            draft: true,
        }),
    ],
};

export default config;
