import { TTSAudio } from "../interfaces";

export class BrowserTTS extends TTSAudio {
    private speechSynthesis = window.speechSynthesis;

    constructor(private speech: SpeechSynthesisUtterance, metadata?: Record<string, unknown>) {
        super();
        this.text = speech.text;
        this.metadata = metadata;
    }

    estimateSpeechDuration() {
        if (this.speech.lang === "ja-JP") {
            const charsPerMinute = 200 / this.speech.rate;
            const chars = this.speech.text.length;
            return (chars / charsPerMinute) * 60;
        } else {
            const wordsPerMinute = 150 * this.speech.rate;
            const words = this.speech.text.split(/\s+/).length;
            return (words / wordsPerMinute) * 60;
        }
    }

    async play(volume?: number): Promise<void> {
        if (this.speechSynthesis.speaking) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.duration = this.estimateSpeechDuration();

            this.speech.onend = () => {
                resolve();
            };

            this.speech.onerror = (event: SpeechSynthesisErrorEvent) => {
                if (event.error === "interrupted") {
                    resolve();
                } else {
                    reject(new Error(`Speech synthesis failed: ${event.error}`));
                }
            };

            if (volume !== undefined) {
                this.speech.volume = volume / 100;
            }

            this.speechSynthesis.speak(this.speech);
        });
    }

    async stop(): Promise<void> {
        this.speechSynthesis.cancel();
    }

    async pause(): Promise<void> {
        this.speechSynthesis.pause();
    }

    async resume(): Promise<void> {
        this.speechSynthesis.resume();
    }
}
