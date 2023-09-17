import {Note} from "trilium/frontend";
import {BackendAPI} from "trilium/backend";
import {ipcRenderer} from "electron";

import ipc from "./ipc.js";
import config, {SettingsData, SSDD} from "./config.js";


let settingsNote: Note | void;

async function getSettingsNote() {
    const settings = await api.searchForNote("#singleFileSettings");
    if (!settings) return api.showError("Trilium SingleFile could not find settings note, you may need to reinstall this addon.");
    return settings;
}


async function getSettings(): Promise<SSDD> {
    if (!settingsNote) settingsNote = await getSettingsNote();
    if (!settingsNote) return getDefaults();

    const content = await settingsNote.getContent();
    try {
        const saved = JSON.parse(content) as Partial<SSDD>;
        return Object.assign({}, getDefaults(), saved);
    }
    catch {
        api.showError("Trilium SingleFile settings note seems to be corrupt.");
        return getDefaults();
    }
}


async function updateSettings(newSettings: Partial<SSDD>): Promise<void> {
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
    const defaults: SSDD = {};
    for (const cat of config) {
        for (const setting of cat.settings) {
            defaults[setting.id] = setting.value;
        }
    }
    return defaults;
}


export {getSettingsNote, getSettings, updateSettings, getDefaults, SettingsData};