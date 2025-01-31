import { AppSettings, DEFAULT_SETTINGS } from "../models/app-settings";
import { AIProviderRegistry } from "../ai/registry";

export class SettingsService {
    private static STORAGE_KEY = "aiSettings";

    static loadSettings(): AppSettings {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        this.updateProviders(settings);
        return settings;
    }

    static saveSettings(settings: AppSettings): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }

    static async updateProviders(settings: AppSettings): Promise<void> {
        try {
            const updateProvider = async (type: "tts" | "stt" | "llm") => {
                const ProviderClass = AIProviderRegistry.getProviderClass(settings[type]);
                const provider = new ProviderClass();
                const config = settings.configs[settings[type]];
                if (config && provider.configure) {
                    provider.configure(config);
                }
                AIProviderRegistry.setActiveProvider(type, provider);
            };

            await Promise.all([updateProvider("tts"), updateProvider("stt"), updateProvider("llm")]);
        } catch (error) {
            console.error("Failed to update AI providers:", error);
            throw error;
        }
    }
}
