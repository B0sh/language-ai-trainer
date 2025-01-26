import React from "react";
import { AIRequestLog } from "../../ai/db";
import SlRelativeTime from "@shoelace-style/shoelace/dist/react/relative-time";
import { AppSettings } from "../../models/app-settings";

interface Props {
    logs: AIRequestLog[];
    settings: AppSettings;
    onSelectLog: (log: AIRequestLog) => void;
}

export const AiLogTable: React.FC<Props> = ({ logs, settings, onSelectLog }) => {
    return (
        <div className="ai-log-table-container">
            <table className="ai-log-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Provider</th>
                        <th>Input</th>
                        <th>Output</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} onClick={() => onSelectLog(log)} className="clickable-row">
                            <td>
                                <SlRelativeTime date={log.date} lang={settings.targetLanguage}></SlRelativeTime>
                            </td>
                            <td>{log.requestType}</td>
                            <td>{log.provider}</td>
                            <td className="text-cell">{log.inputText || "N/A"}</td>
                            <td className="text-cell">{log.outputText || "N/A"}</td>
                            <td>
                                <span className={`status ${log.response === "success" ? "success" : "error"}`}>
                                    {log.response}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style>{`
                .ai-log-table-container {
                    overflow-x: auto;
                }

                .ai-log-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: var(--sl-color-neutral-0);
                    border: 1px solid var(--sl-color-neutral-200);
                }

                .ai-log-table th,
                .ai-log-table td {
                    padding: 0.75rem;
                    border: 1px solid var(--sl-color-neutral-200);
                    text-align: left;
                }

                .ai-log-table th {
                    background: var(--sl-color-neutral-100);
                    font-weight: var(--sl-font-weight-semibold);
                }

                .text-cell {
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .status {
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }

                .status.success {
                    background: var(--sl-color-success-100);
                    color: var(--sl-color-success-700);
                }

                .status.error {
                    background: var(--sl-color-danger-100);
                    color: var(--sl-color-danger-700);
                }

                .clickable-row {
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .clickable-row:hover {
                    background-color: var(--sl-color-neutral-100);
                }
            `}</style>
        </div>
    );
};
