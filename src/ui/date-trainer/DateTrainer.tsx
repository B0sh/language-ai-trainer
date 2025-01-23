import React from "react";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import "./DateTrainer.css";

export const DateTrainer = () => {
    return (
        <div className="date-trainer">
            <div className="date-section">Section 1</div>
            <div className="date-section">
                <SlInput type="date" size="large" pill></SlInput>
            </div>
            <div className="date-section">Section 3</div>
        </div>
    );
};
