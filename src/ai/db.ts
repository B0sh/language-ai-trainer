export interface AIRequestLog {
    id?: number;
    date?: Date;
    provider: string;
    requestType: "llm" | "stt" | "tts" | "llm_chat";
    model?: string;
    response?: string;
    inputText?: string;
    outputText?: string;
    metadata?: Record<string, unknown>;
}
export const AI_REQUEST_TYPE = {
    llm: "llm",
    stt: "stt",
    tts: "tts",
    llm_chat: "llm_chat",
};

class AIRequestDatabase {
    private db: IDBDatabase | null = null;
    private readonly DB_NAME = "aiRequest";
    private readonly STORE_NAME = "requests";
    private readonly VERSION = 1;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const store = db.createObjectStore(this.STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true,
                    });

                    // Create indexes
                    store.createIndex("date", "date");
                    store.createIndex("provider", "provider");
                    store.createIndex("requestType", "requestType");
                }
            };
        });
    }

    async logRequest(log: AIRequestLog): Promise<number> {
        if (!this.db) {
            await this.init();
        }

        log.date = log.date || new Date();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], "readwrite");
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.add(log);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async getRequests(): Promise<AIRequestLog[]> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], "readonly");
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () =>
                resolve(request.result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            request.onerror = () => reject(request.error);
        });
    }

    async clearLogs(): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], "readwrite");
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export const aiRequestDB = new AIRequestDatabase();
