import {app} from "@electron/remote";

export interface SettingsCategory {
    name: string;
    note?: string;
    settings: Record<string, TextSetting | SwitchSetting | FileSetting>;
}

export type SettingType = "switch" | "file" | "text";

export interface Setting {
    name: string;
    note: string;
    type: SettingType;
    disabled?: boolean;
    value: unknown;
}

export interface TextSetting extends Setting {
    type: "text";
    value: string;
}

export interface SwitchSetting extends Setting {
    type: "switch";
    value: boolean;
}

export interface FileSetting extends Setting {
    type: "file";
    value: string;
    directory?: boolean;
}

const config = [
    {
        name: "File Watcher",
        settings: {
            watchFolder: {
                name: "Watch Folder",
                note: "Directory that should be watched for new SingleFile pages.",
                type: "file",
                value: app.getPath("downloads")
            },
            shouldWatch: {
                name: "Should Watch",
                note: "Whether the file watcher should be active.",
                type: "switch",
                value: true
            },
        }
    },
    {
        name: "Templates",
        note: "The templates in this section can use different variables. Currently available: {pageTitle}, {pageUrl}, {saveDate}.",
        settings: {
            titleTemplate: {
                name: "Title Template",
                note: "Template to use for new import titles.",
                type: "text",
                value: "{pageTitle}"
            },
            addressTemplate: {
                name: "Address Template",
                note: "Template for information to put in the address bar.",
                type: "text",
                value: "{pageUrl}"
            },
            shouldUseBrowser: {
                name: "Browser Template",
                note: "Whether imports should use the fancy pseudo-browser interface.",
                type: "switch",
                value: true
            },
            iconTemplate: {
                name: "Icon",
                note: "Box icon to use when importing files to notes.",
                type: "text",
                value: "bx-world"
            }
        }
    },
    {
        name: "Imports",
        settings: {
            shouldDeleteImport: {
                name: "Delete After Import",
                note: "Whether the original file should be deleted after importing.",
                type: "switch",
                value: false,
                disabled: true
            },
        }
    }
];

// export type SettingIDs = typeof config[number]["settings"][number]["id"];
// export type SettingValues = typeof config[number]["settings"][number]["value"];
// export type SettingsData = Record<SettingIDs, SettingValues>;


export type SettingIDs = keyof typeof config[number]["settings"];
export type SettingValues = NonNullable<typeof config[number]["settings"][SettingIDs]>["value"];

type MapSettingData<Type extends SettingsCategory[]> = {
    [k in SettingIDs]: NonNullable<Type[number]["settings"][k]>["value"];
}

// @ts-expect-error stupid
export type SettingsData = MapSettingData<typeof config>;

// const ttest: SSDD = {
//     shouldWatch: false,
//     watchFolder: "7"
// };
// console.log(ttest);

export default config;