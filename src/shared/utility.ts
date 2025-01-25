export function openUrl(url: string) {
    window.electron.ipcRenderer.invoke("open-external-url", url);
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
