import { SlBadge, SlIconButton } from "@shoelace-style/shoelace/dist/react";
import React from "react";
import { TargetLanguage } from "../../../shared/languages";

interface Props {
    isPlaying: boolean;
    onStop: () => void;
    language: TargetLanguage;
    configLabel?: string;
}

export const TrainerHeaderBadges: React.FC<Props> = ({ isPlaying, onStop, language, configLabel }) => {
    return (
        <div>
            {isPlaying && (
                <SlIconButton name="x-lg" style={{ fontSize: "0.75rem", verticalAlign: "middle" }} onClick={onStop} />
            )}
            {configLabel && (
                <SlBadge
                    variant="primary"
                    pill
                    style={{ fontSize: "0.75rem", verticalAlign: "middle", marginRight: "4px" }}
                >
                    {configLabel}
                </SlBadge>
            )}
            <SlBadge variant="primary" pill style={{ fontSize: "0.75rem", verticalAlign: "middle" }}>
                {language.description}
            </SlBadge>
        </div>
    );
};
