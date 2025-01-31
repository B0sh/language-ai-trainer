import * as path from "path";
import { app } from "electron";

export function setupAboutPanel(): void {
    const iconPath = path.resolve(__dirname, "../assets/icons/AppIcon.png");

    app.setAboutPanelOptions({
        applicationName: "Walden's AI Language Trainer",
        applicationVersion: app.getVersion(),
        authors: ["Walden Perry"],
        copyright: "© Walden Perry",
        credits: "https://github.com/B0sh/language-ai-trainer",
        iconPath,
        version: process.versions.electron,
        website: "https://waldens.world/",
    });
}
