import * as React from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { AppSettings } from "../../models/app-settings";
import { TARGET_LANGUAGES } from "../../shared/languages";

interface Props {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
    onStart: () => void;
}

export const CompTrainerMenu: React.FC<Props> = ({ settings, onStart, onSettingsChange }) => {
    const language = TARGET_LANGUAGES.find((l) => l.id === settings.targetLanguage)?.description;
    return (
        <>
            <div>
                Practice your listening skill!
                <br />
                <br />
                AI will speak some random sentences in {language}, and you will need to describe what was said. The AI
                will judge your answers. <i>Just for fun!</i>
            </div>

            <SlButton variant="success" size="large" className="play-button" pill onClick={onStart}>
                <SlIcon slot="prefix" name="play-fill" />
                Start!
            </SlButton>
        </>
    );
};
