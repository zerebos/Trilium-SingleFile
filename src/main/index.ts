import {FSWatcher} from "fs";
import {ipcMain} from "@electron/remote";

import ipc from "../common/ipc.js";

import checkAndImport from "./import.js";
import startWatcher from "./watcher.js";
import * as Settings from "../common/settings.js";
import {isDesktop} from "../common/platform.js";
import {ImportEvent} from "../common/event.js";


let watcher: FSWatcher;

async function settingsUpdated() {
    const settings = await Settings.getSettings();
    watcher?.close?.();
    if (settings.shouldWatch) watcher = startWatcher(settings.watchFolder, checkAndImport);
}


declare global {
    interface Window { singleFileEventListener: (ev: ImportEvent) => void; }
}


async function initialize() {
    if (isDesktop()) {
        ipcMain.removeHandler(ipc.IMPORT);
        ipcMain.handle(ipc.IMPORT, (_, file: string, content?: string) => checkAndImport(file, content)); // Invoke with await ipcRenderer.invoke(ipc.IMPORT, fullpath);

        const settings = await Settings.getSettings();
        if (settings.shouldWatch) watcher = startWatcher(settings.watchFolder, checkAndImport);
        
        ipcMain.removeHandler(ipc.SETTINGS_UPDATE);
        ipcMain.handle(ipc.SETTINGS_UPDATE, settingsUpdated); // eslint-disable-line @typescript-eslint/no-misused-promises
    }
    else {
        const importListener = (ev: ImportEvent) => {
            void checkAndImport(ev.detail.name, ev.detail.content);
        };

        if (window.singleFileEventListener) window.removeEventListener(ipc.IMPORT, window.singleFileEventListener);
        window.singleFileEventListener = importListener;
        window.addEventListener(ipc.IMPORT, importListener);
    }
}

// eslint-disable-next-line no-console
initialize().catch(console.error);