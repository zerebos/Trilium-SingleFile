import {FSWatcher} from "fs";
import {ipcMain} from "@electron/remote";

import ipc from "../common/ipc.js";

import checkAndImport from "./import.js";
import startWatcher from "./watcher.js";
import * as Settings from "../common/settings.js";


let watcher: FSWatcher;

async function settingsUpdated() {
    const settings = await Settings.getSettings();
    watcher?.close?.();
    if (settings.shouldWatch) watcher = startWatcher(settings.watchFolder, checkAndImport);
}


async function initialize() {
    ipcMain.removeHandler(ipc.IMPORT);
    ipcMain.handle(ipc.IMPORT, (_, file) => checkAndImport(file as string)); // Invoke with await ipcRenderer.invoke(ipc.IMPORT, fullpath);
    
    const settings = await Settings.getSettings();
    if (settings.shouldWatch) watcher = startWatcher(settings.watchFolder, checkAndImport);
    
    ipcMain.removeHandler(ipc.SETTINGS_UPDATE);
    ipcMain.handle(ipc.SETTINGS_UPDATE, settingsUpdated); // eslint-disable-line @typescript-eslint/no-misused-promises
}

// eslint-disable-next-line no-console
initialize().catch(console.error);

// Temporary for testing/debugging
// TODO: remove
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.singleFileSettings = Settings;