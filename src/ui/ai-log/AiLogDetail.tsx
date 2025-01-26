import React from "react";
import { AIRequestLog } from "../../ai/db";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { AppSettings } from "../../models/app-settings";
import SlFormatDate from "@shoelace-style/shoelace/dist/react/format-date";

interface Props {
    log: AIRequestLog;
    settings: AppSettings;
}

export const AiLogDetail: React.FC<Props> = ({ log, settings }) => {
    const formatMetadata = (metadata?: Record<string, unknown>) => {
        if (!metadata) return "N/A";
        try {
            return JSON.stringify(metadata, null, 2);
        } catch {
            return "Unable to parse metadata.";
        }
    };

    return (
        <>
            <div className="detail-meta">
                <div className="meta-item">
                    <label>Time:</label>
                    <SlFormatDate
                        date={log.date}
                        lang={settings.targetLanguage}
                        month="long"
                        day="numeric"
                        year="numeric"
                        hour="numeric"
                        minute="numeric"
                        hour-format="12"
                    ></SlFormatDate>
                </div>
                <div className="meta-item">
                    <label>Type:</label>
                    <span>
                        {log.requestType === "llm"
                            ? "LLM"
                            : log.requestType === "stt"
                            ? "Speech-to-Text"
                            : "Text-to-Speech"}
                    </span>
                </div>
                <div className="meta-item">
                    <label>Provider:</label>
                    <span>{log.provider}</span>
                </div>
                <div className="meta-item">
                    <label>Status:</label>
                    <span className={`status ${log.response === "success" ? "success" : "error"}`}>{log.response}</span>
                </div>
            </div>

            <div className="detail-content">
                <section>
                    <h3>Input</h3>
                    <pre className="content-box">{log.inputText || "N/A"}</pre>
                </section>

                <section>
                    <h3>Output</h3>
                    <pre className="content-box">{log.outputText || "N/A"}</pre>
                </section>

                <section>
                    <h3>Metadata</h3>
                    <pre className="content-box">{formatMetadata(log.metadata)}</pre>
                </section>
            </div>

            <style>{`

                .detail-meta {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: var(--sl-color-neutral-50);
                    border-radius: var(--sl-border-radius-medium);
                }

                .meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .meta-item label {
                    font-weight: var(--sl-font-weight-semibold);
                    color: var(--sl-color-neutral-600);
                }

                .detail-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .detail-content section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .content-box {
                    padding: 1rem;
                    background: var(--sl-color-neutral-50);
                    border-radius: var(--sl-border-radius-x-large);
                    white-space: pre-wrap;
                    overflow-x: auto;
                    margin: 0;
                }

                .status {
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    width: fit-content;
                }

                .status.success {
                    background: var(--sl-color-success-100);
                    color: var(--sl-color-success-700);
                }

                .status.error {
                    background: var(--sl-color-danger-100);
                    color: var(--sl-color-danger-700);
                }
            `}</style>
        </>
    );
};
