import * as React from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { AppSettings } from "../../models/app-settings";
import { TARGET_LANGUAGES } from "../../shared/languages";

interface Props {
    settings: AppSettings;
    onStart: () => void;
}

export const NumberTrainerMenu: React.FC<Props> = ({ settings, onStart }) => {
    const language = TARGET_LANGUAGES.find((l) => l.id === settings.targetLanguage);

    if (!language) {
        throw new Error(
            "You do not have a target selection set!\n\nPlease select a target language in the settings panel."
        );
    }

    return (
        <>
            <div>
                The Number Trainer tests your ability to hear numbers. A number will be spoken, and you must type it
                out.
            </div>

            <SlButton variant="success" size="large" className="play-button" pill onClick={onStart}>
                <SlIcon slot="prefix" name="play-fill" />
                Start!
            </SlButton>
        </>
    );
};
