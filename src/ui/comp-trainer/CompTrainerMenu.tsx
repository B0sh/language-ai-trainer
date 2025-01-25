import * as React from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { AppSettings } from "../../models/app-settings";

interface Props {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
    onStart: () => void;
}

export const CompTrainerMenu: React.FC<Props> = ({ settings, onStart, onSettingsChange }) => {
    return (
        <>
            <div>
                The Comprehension Trainer tests your ability to understand text. Sentences will be spoken, and you must
                write a summary of what was said.
            </div>

            <SlButton variant="success" size="large" className="play-button" pill onClick={onStart}>
                <SlIcon slot="prefix" name="play-fill" />
                Start!
            </SlButton>
        </>
    );
};
