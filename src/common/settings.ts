import {Note} from "trilium/frontend";
import {BackendAPI} from "trilium/backend";
import {ipcRenderer} from "electron";

import ipc from "./ipc.js";
import config, {SettingsData} from "./config.js";
import {isDesktop} from "./platform.js";


let settingsNote: Note | void;

async function getSettingsNote() {
    const settings = await api.searchForNote("#singleFileSettings");
    if (!settings) return api.showError("Trilium SingleFile could not find settings note, you may need to reinstall this addon.");
    return settings;
}


async function getSettings(): Promise<SettingsData> {
    if (!settingsNote) settingsNote = await getSettingsNote();
    if (!settingsNote) return getDefaults();

    const content = await settingsNote.getContent();
    try {
        const saved = JSON.parse(content) as Partial<SettingsData>;
        return Object.assign({}, getDefaults(), saved);
    }
    catch {
        api.showError("Trilium SingleFile settings note seems to be corrupt.");
        return getDefaults();
    }
}


async function updateSettings(newSettings: Partial<SettingsData>): Promise<void> {
    const current = await getSettings();
    Object.assign(current, newSettings);

    if (!settingsNote) settingsNote = await getSettingsNote();
    if (!settingsNote) return;

    await api.runOnBackend((id: string, content: string) => {
        (api as unknown as BackendAPI).getNote(id)?.setContent(content);
    }, [settingsNote.noteId, JSON.stringify(current, null, 4)]);

    if (isDesktop()) await ipcRenderer.invoke(ipc.SETTINGS_UPDATE);
}


function getDefaults() {
    const defaults: Partial<Record<keyof SettingsData, SettingsData[keyof SettingsData]>> = {};
    for (const cat of config) {
        if (!cat.settings) continue;
        for (const id in cat.settings) {
            if (!id) continue;
            const val = cat.settings[id as keyof SettingsData]?.value;
            if (typeof(val) === "undefined") continue;
            defaults[id as keyof SettingsData] = val;
        }
    }
    return defaults as SettingsData;
}


export {getSettingsNote, getSettings, updateSettings, getDefaults, SettingsData};