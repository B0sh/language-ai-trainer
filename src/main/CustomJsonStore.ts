import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

export class CustomJsonStore {
    private data: Record<string, unknown>;
    private filePath: string;

    constructor(storeKey: string) {
        const userDataPath = app.getPath("userData");
        this.filePath = path.join(userDataPath, `settings`, `${storeKey}.json`);

        console.log("USER PATH", this.filePath);

        try {
            this.data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
        } catch (error) {
            this.data = {};
        }
    }

    get(key: string): unknown | undefined {
        return this.data?.[key];
    }

    set(key: string, value: unknown): void {
        this.data[key] = value;
    }

    delete(key: string): void {
        delete this.data[key];
    }

    async save(): Promise<void> {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            await fs.promises.mkdir(dir, { recursive: true });
        }
        await fs.promises.writeFile(this.filePath, JSON.stringify(this.data));
    }
}
