export function openUrl(url: string) {
    window.electron.ipcRenderer.invoke("open-external-url", url);
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomElement<T>(array: T[]): T {
    return array[getRandomInt(0, array.length - 1)];
}
