import React from "react";
import { AIRequestLog } from "../../ai/db";
import SlRelativeTime from "@shoelace-style/shoelace/dist/react/relative-time";
import { AppSettings } from "../../models/app-settings";
import "./AiLogTable.css";

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
                                    {log.response === "success" ? "Success" : "Error"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
