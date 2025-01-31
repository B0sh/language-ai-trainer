import { screen, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { CustomJsonStore } from "./CustomJsonStore";

export class BrowserWindowWithSavedPosition extends BrowserWindow {
    store: CustomJsonStore;

    constructor(options?: BrowserWindowConstructorOptions) {
        const state: BrowserWindowConstructorOptions = {
            ...options,
        };

        let store: CustomJsonStore;

        try {
            store = new CustomJsonStore("window");

            const savedDisplay = store.get("display") as Electron.Rectangle;
            if (savedDisplay && typeof savedDisplay === "object") {
                const x: number = parseInt(store.get("x") as string, 10);
                const y: number = parseInt(store.get("y") as string, 10);
                const width: number = parseInt(store.get("width") as string, 10);
                const height: number = parseInt(store.get("height") as string, 10);

                const display = screen.getDisplayNearestPoint({ x, y });

                if (
                    display.bounds.width === savedDisplay.width &&
                    display.bounds.height === savedDisplay.height &&
                    !isNaN(x) &&
                    !isNaN(y) &&
                    !isNaN(width) &&
                    !isNaN(height)
                ) {
                    state.x = x;
                    state.y = y;
                    state.width = width;
                    state.height = height;
                }
            }
        } catch (error) {
            // can continue with default browser options
            console.error("Error loading window position", error);
        }

        super(state);

        this.store = store;

        this.once("close", () => {
            this.savePosition();
        });
    }

    async savePosition() {
        const bounds = this.getBounds();

        const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });

        this.store.set("x", bounds.x);
        this.store.set("y", bounds.y);
        this.store.set("width", bounds.width);
        this.store.set("height", bounds.height);
        this.store.set("display", display.bounds);

        await this.store.save();
    }
}
