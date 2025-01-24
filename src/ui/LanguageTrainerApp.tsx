import SlDrawer from "@shoelace-style/shoelace/dist/react/drawer";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import * as React from "react";
import { useState, useEffect, createRef } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { DateTrainer } from "./date-trainer/DateTrainer";
import { NumberTrainer } from "./number-trainer/NumberTrainer";
import { Settings } from "./settings/Settings";
import "./LanguageTrainerApp.css";
import { SpeakingTrainer } from "./speaking-trainer/SpeakingTrainer";
import { AppSettings } from "../models/app-settings";
import { SettingsService } from "../services/settings-service";
import { ErrorFallback } from "./error-fallback/ErrorFallback";
import { Home } from "./home/Home";

export const LanguageTrainerApp: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const errorBoundaryRef = createRef<ErrorBoundary>();

    const [settings, setSettings] = useState<AppSettings>(() => SettingsService.loadSettings());

    const handleSettingsChange = (newSettings: AppSettings) => {
        SettingsService.saveSettings(newSettings);
        SettingsService.updateProviders(newSettings);
        setSettings(newSettings);
    };

    const selectMenu = (menu: string) => {
        if (menu === selectedMenu) {
            setSelectedMenu("home");
        } else {
            setSelectedMenu(menu);
        }

        errorBoundaryRef.current?.resetErrorBoundary();
    };

    useEffect(() => {
        const storedMenu = localStorage.getItem("selectedMenu");
        if (storedMenu) {
            setSelectedMenu(storedMenu);
        } else {
            setSelectedMenu("home");
        }
    }, []);

    useEffect(() => {
        if (selectedMenu) {
            localStorage.setItem("selectedMenu", selectedMenu);
        }
    }, [selectedMenu]);

    const renderContent = () => {
        switch (selectedMenu) {
            case "speaking":
                return <SpeakingTrainer />;
            case "date":
                return <DateTrainer />;
            case "number":
                return <NumberTrainer settings={settings} />;
            case "settings":
                return <Settings settings={settings} onSettingsChange={handleSettingsChange} />;
        }
        return <Home />;
    };

    let theme = "";
    if (settings.theme === "light") {
        theme = "sl-theme-light";
    } else if (settings.theme === "dark") {
        theme = "sl-theme-dark";
    } else if (settings.theme === "auto") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            theme = "sl-theme-dark";
        } else {
            theme = "sl-theme-light";
        }
    }

    const onError = (error: Error, info: React.ErrorInfo) => {
        setSelectedMenu("home");
    };

    const onErrorReset = () => {
        console.log("ErrorBoundary reset");
    };

    // TODO: find a better solution to this
    document.body.setAttribute("class", theme);

    return (
        <div className={theme}>
            <header>
                <SlIconButton
                    className="menu-button"
                    name="list"
                    label="Menu"
                    onClick={() => setOpen(!open)}
                ></SlIconButton>

                <span className="title">Walden's AI Language Trainer</span>
            </header>
            <div className="container">
                <nav>
                    <SlDrawer
                        className="menu-drawer"
                        label="Menu"
                        contained
                        noHeader
                        open={open}
                        placement="start"
                        onSlAfterHide={() => setOpen(false)}
                    >
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "speaking" ? "selected" : ""}
                            onClick={() => selectMenu("speaking")}
                        >
                            <SlIcon slot="prefix" name="soundwave"></SlIcon>
                            Speaking Trainer
                        </SlButton>
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "date" ? "selected" : ""}
                            onClick={() => selectMenu("date")}
                        >
                            <SlIcon slot="prefix" name="calendar"></SlIcon>
                            Date Trainer
                        </SlButton>
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "number" ? "selected" : ""}
                            onClick={() => selectMenu("number")}
                        >
                            <SlIcon slot="prefix" name="123"></SlIcon>
                            Number Trainer
                        </SlButton>
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "settings" ? "selected" : ""}
                            onClick={() => selectMenu("settings")}
                        >
                            <SlIcon slot="prefix" name="gear"></SlIcon>
                            Settings
                        </SlButton>
                    </SlDrawer>
                </nav>
                <main className={open ? "drawer-open" : "drawer-closed"}>
                    <ErrorBoundary
                        ref={errorBoundaryRef}
                        FallbackComponent={ErrorFallback}
                        onError={onError}
                        onReset={onErrorReset}
                    >
                        {renderContent()}
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};
