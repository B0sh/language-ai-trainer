export function openUrl(url: string) {
    window.electron.ipcRenderer.invoke("open-external-url", url);
}
