import SlDrawer from "@shoelace-style/shoelace/dist/react/drawer";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import * as React from "react";
import { useState, useEffect } from "react";
import { DateTrainer } from "./date-trainer/DateTrainer";
import { NumberTrainer } from "./number-trainer/NumberTrainer";
import { Settings } from "./settings/Settings";
import "./Layout.css";
import { SpeakingTrainer } from "./speaking-trainer/SpeakingTrainer";

export const Layout: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

    useEffect(() => {
        const storedMenu = localStorage.getItem("selectedMenu");
        console.log(storedMenu);
        if (storedMenu) {
            setSelectedMenu(storedMenu);
        } else {
            setSelectedMenu("settings");
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
                return <NumberTrainer />;
            case "settings":
                return <Settings />;
        }
        return null;
    };

    return (
        <>
            <header>
                <SlIconButton
                    className="menu-button"
                    name="list"
                    label="Menu"
                    onClick={() => setOpen(!open)}
                ></SlIconButton>

                <span className="title">Japanese Language AI Trainer</span>
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
                            onClick={() => setSelectedMenu("speaking")}
                        >
                            <SlIcon slot="prefix" name="soundwave"></SlIcon>
                            Speaking Trainer
                        </SlButton>
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "date" ? "selected" : ""}
                            onClick={() => setSelectedMenu("date")}
                        >
                            <SlIcon slot="prefix" name="calendar"></SlIcon>
                            Date Trainer
                        </SlButton>
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "number" ? "selected" : ""}
                            onClick={() => setSelectedMenu("number")}
                        >
                            <SlIcon slot="prefix" name="123"></SlIcon>
                            Number Trainer
                        </SlButton>
                        <SlButton
                            variant="text"
                            size="large"
                            className={selectedMenu === "settings" ? "selected" : ""}
                            onClick={() => setSelectedMenu("settings")}
                        >
                            <SlIcon slot="prefix" name="gear"></SlIcon>
                            Settings
                        </SlButton>
                    </SlDrawer>
                </nav>
                <main className={open ? "drawer-open" : "drawer-closed"}>{renderContent()}</main>
            </div>
        </>
    );
};
