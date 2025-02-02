import { SlBadge, SlIconButton } from "@shoelace-style/shoelace/dist/react";
import React from "react";
import { TargetLanguage } from "../../../shared/languages";
import { TargetLanguageLevel } from "../../../models/app-settings";

interface Props {
    isPlaying: boolean;
    onStop: () => void;
    language: TargetLanguage;
    configLabel?: string;
    targetLanguageLevel: TargetLanguageLevel;
}

export const TrainerHeaderBadges: React.FC<Props> = ({
    isPlaying,
    onStop,
    language,
    configLabel,
    targetLanguageLevel,
}) => {
    const getLevelBadge = () => {
        switch (targetLanguageLevel) {
            case "low":
                return (
                    <SlBadge variant="neutral" pill className="trainer-badge">
                        Beginner
                    </SlBadge>
                );
            case "medium":
                return (
                    <SlBadge variant="neutral" pill className="trainer-badge">
                        Intermediate
                    </SlBadge>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {isPlaying && <SlIconButton name="x-lg" className="trainer-icon-button" onClick={onStop} />}
            {configLabel && (
                <SlBadge variant="primary" pill className="trainer-badge">
                    {configLabel}
                </SlBadge>
            )}
            {getLevelBadge()}
            <SlBadge variant="primary" pill className="trainer-badge">
                {language.description}
            </SlBadge>
        </div>
    );
};
