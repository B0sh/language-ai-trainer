import React from "react";
import SlDialog from "@shoelace-style/shoelace/dist/react/dialog";

interface Props {
    open: boolean;
    onClose: () => void;
    originalText: string;
    correctedText: string;
    explanation: string;
}

export const CorrectionDialog: React.FC<Props> = ({ open, onClose, originalText, correctedText, explanation }) => {
    return (
        <SlDialog label="Correction Details" open={open} onSlAfterHide={onClose}>
            <div className="correction-details">
                <h3>Original Text</h3>
                <p>{originalText}</p>

                <h3>Suggested Text</h3>
                <p>{correctedText}</p>

                <h3>AI Analysis</h3>
                <p>{explanation}</p>
            </div>
        </SlDialog>
    );
};
