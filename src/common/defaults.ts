import {app} from "@electron/remote";


export interface SettingsType {
    // Watcher Settings
    shouldWatch: boolean;
    watchFolder: string;

    // Customization
    titleTemplate: string;
    addressTemplate: string;

    // Import Settings
    deleteAfterImport: boolean;
}

const defaultSettings: SettingsType = {
    // Watcher Settings
    shouldWatch: true,
    watchFolder: app.getPath("downloads"),

    // Customization
    titleTemplate: "{pageTitle}",
    addressTemplate: "{pageUrl}",

    // Import Settings
    deleteAfterImport: false
};

export default defaultSettings;