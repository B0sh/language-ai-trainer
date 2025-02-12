import { TTSAudio } from "../interfaces";

export class GoogleTTSAudio extends TTSAudio {
    private audioElement: HTMLAudioElement;

    constructor(text: string, audioContent: string, metadata?: Record<string, unknown>) {
        super();
        this.audioElement = new Audio(`data:audio/mp3;base64,${audioContent}`);
        this.text = text;
        this.metadata = metadata;
    }

    async decodeAudio(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.audioElement.onloadedmetadata = () => {
                this.duration = this.audioElement.duration;
                resolve();
            };
            this.audioElement.onerror = (e) => reject(new Error(`Audio decoding failed: ${e}`));
        });
    }

    async play(volume?: number): Promise<void> {
        if (!this.audioElement.paused) {
            return;
        }

        if (volume !== undefined) {
            this.audioElement.volume = volume / 100;
        }

        return new Promise((resolve, reject) => {
            this.audioElement.onended = () => resolve();
            this.audioElement.onerror = (e) => reject(new Error(`Audio playback failed: ${e}`));
            this.audioElement.play().catch(reject);
            this.duration = this.audioElement.duration;
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
