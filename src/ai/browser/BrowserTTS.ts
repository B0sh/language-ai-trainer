import { TTSAudio } from "../interfaces";

export class BrowserTTS extends TTSAudio {
    private speechSynthesis = window.speechSynthesis;

    constructor(private speech: SpeechSynthesisUtterance) {
        super();
        this.text = speech.text;
    }

    async play(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.speech.onend = () => {
                resolve();
            };

            this.speech.onerror = (event: SpeechSynthesisErrorEvent) => {
                reject(new Error(`Speech synthesis failed: ${event.error}`));
            };

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
