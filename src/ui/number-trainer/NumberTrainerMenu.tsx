import * as React from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";

interface Props {
    onStart: () => void;
}

export const NumberTrainerMenu: React.FC<Props> = ({ onStart }) => {
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
