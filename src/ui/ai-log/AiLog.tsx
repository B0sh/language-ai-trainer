import { SlButton } from "@shoelace-style/shoelace/dist/react";
import React, { useEffect, useState } from "react";
import { aiRequestDB, AIRequestLog } from "../../ai/db";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlBreadcrumb from "@shoelace-style/shoelace/dist/react/breadcrumb";
import SlBreadcrumbItem from "@shoelace-style/shoelace/dist/react/breadcrumb-item";
import { AppSettings } from "../../models/app-settings";
import { AiLogTable } from "./AiLogTable";
import { AiLogDetail } from "./AiLogDetail";

interface Props {
    settings: AppSettings;
}

export const AiLog: React.FC<Props> = ({ settings }) => {
    const [logs, setLogs] = useState<AIRequestLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<AIRequestLog | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const results = await aiRequestDB.getRequests();
            setLogs(results);
        } catch (error) {
            console.error("Failed to fetch AI logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) {
        return <SlSpinner className="large-spinner"></SlSpinner>;
    }

    return (
        <div className="ai-log">
            <div className="ai-log-header">
                <SlBreadcrumb>
                    <SlBreadcrumbItem onClick={() => setSelectedLog(null)}>AI Request Logs</SlBreadcrumbItem>
                    {selectedLog && <SlBreadcrumbItem>Details</SlBreadcrumbItem>}
                </SlBreadcrumb>
                {/* <SlButton onClick={() => fetchLogs()}>Wipe Logs</SlButton> */}
            </div>
            {selectedLog ? (
                <AiLogDetail log={selectedLog} settings={settings} />
            ) : (
                <AiLogTable logs={logs} settings={settings} onSelectLog={setSelectedLog} />
            )}
            <style>{`
                .ai-log {
                    padding: 1rem;
                }

                .ai-log-header {
                    font-size: 2rem;
                    margin-bottom: 1rem;

                    sl-breadcrumb-item::part(base) {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }
                }

            `}</style>
        </div>
    );
};
