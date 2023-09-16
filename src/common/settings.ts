import {Note} from "trilium/frontend";
import {BackendAPI} from "trilium/backend";
import {ipcRenderer} from "electron";

import ipc from "./ipc.js";
import defaultSettings, {SettingsType} from "./defaults.js";


let settingsNote: Note | void;

async function getSettingsNote() {
    const settings = await api.searchForNote("#singleFileSettings");
    if (!settings) return api.showError("Trilium SingleFile could not find settings note, you may need to reinstall this addon.");
    return settings;
}


async function getSettings(): Promise<SettingsType> {
    if (!settingsNote) settingsNote = await getSettingsNote();
    if (!settingsNote) return Object.assign({}, defaultSettings);

    const content = await settingsNote.getContent();
    try {
        const saved = JSON.parse(content) as Partial<SettingsType>;
        return Object.assign({}, defaultSettings, saved);
    }
    catch {
        api.showError("Trilium SingleFile settings note seems to be corrupt.");
        return Object.assign({}, defaultSettings);
    }
}


async function updateSettings(newSettings: Partial<SettingsType>): Promise<void> {
    const current = await getSettings();
    Object.assign(current, newSettings);

    if (!settingsNote) settingsNote = await getSettingsNote();
    if (!settingsNote) return;

    await api.runOnBackend((id: string, content: string) => {
        (api as unknown as BackendAPI).getNote(id)?.setContent(content);
    }, [settingsNote.noteId, JSON.stringify(current, null, 4)]);

    await ipcRenderer.invoke(ipc.SETTINGS_UPDATE);
}


function getDefaults() {
    return Object.assign({}, defaultSettings);
}


export {getSettingsNote, getSettings, updateSettings, getDefaults, SettingsType};