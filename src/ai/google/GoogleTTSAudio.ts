import { TTSAudio } from "../interfaces";

export class GoogleTTSAudio extends TTSAudio {
    private audioElement: HTMLAudioElement;

    constructor(text: string, audioContent: string) {
        super();
        this.audioElement = new Audio(`data:audio/mp3;base64,${audioContent}`);
        this.text = text;
    }

    async play(): Promise<void> {
        if (!this.audioElement.paused) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.audioElement.onended = () => resolve();
            this.audioElement.onerror = (e) => reject(new Error(`Audio playback failed: ${e}`));
            this.audioElement.play().catch(reject);
        });
    }

    async stop(): Promise<void> {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }

    async pause(): Promise<void> {
        this.audioElement.pause();
    }

    async resume(): Promise<void> {
        return this.audioElement.play();
    }
}
