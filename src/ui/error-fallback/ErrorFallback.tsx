import * as React from "react";
import { FallbackProps } from "react-error-boundary";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import "./ErrorFallback.css";

export const ErrorFallback = ({ error }: FallbackProps) => {
    return (
        <div className="error-fallback">
            <SlIcon name="exclamation-triangle" className="error-icon"></SlIcon>
            <h2>Something went wrong</h2>
            <pre className="error-message">{error.message}</pre>
        </div>
    );
};
