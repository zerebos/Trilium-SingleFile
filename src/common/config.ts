import {app} from "@electron/remote";

export interface SettingsCategory {
    name: string;
    note?: string;
    settings: (TextSetting | SwitchSetting | FileSetting)[];
}

export type SettingType = "switch" | "file" | "text";

export interface Setting {
    id?: string;
    name: string;
    note: string;
    type: SettingType;
    disabled?: boolean;
    value: any;
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

const config: SettingsCategory[] = [
    {
        name: "File Watcher",
        settings: [
            {
                id: "watchFolder",
                name: "Watch Folder",
                note: "Directory that should be watched for new SingleFile pages.",
                type: "file",
                value: app.getPath("downloads")
            },
            {
                id: "shouldWatch",
                name: "Should Watch",
                note: "Whether the file watcher should be active.",
                type: "switch",
                value: true
            },
        ]
    },
    {
        name: "Templates",
        note: "The templates in this section can use different variables. Currently available: {pageTitle}, {pageUrl}, {saveDate}.",
        settings: [
            {
                id: "titleTemplate",
                name: "Title Template",
                note: "Template to use for new import titles.",
                type: "text",
                value: "{pageTitle}"
            },
            {
                id: "addressTemplate",
                name: "Address Template",
                note: "Template for information to put in the address bar.",
                type: "text",
                value: "{pageUrl}"
            },
            {
                id: "shouldUseBrowser",
                name: "Browser Template",
                note: "Whether imports should use the fancy pseudo-browser interface.",
                type: "switch",
                value: true
            },
        ]
    },
    {
        name: "Imports",
        settings: [
            {
                id: "shouldDeleteImport",
                name: "Delete After Import",
                note: "Whether the original file should be deleted after importing.",
                type: "switch",
                value: false,
                disabled: true
            },
        ]
    }
];

export type SettingIDs = typeof config[number]["settings"][number]["id"];
export type SettingValues = typeof config[number]["settings"][number]["value"];
export type SettingsData = Record<SettingIDs, SettingValues>;

const configo = [
    {
        name: "File Watcher",
        settings: {
            watchFolder: {
                name: "Watch Folder",
                note: "Directory that should be watched for new SingleFile pages.",
                type: "file",
                value: ""
            } as FileSetting,
            shouldWatch: {
                name: "Should Watch",
                note: "Whether the file watcher should be active.",
                type: "switch",
                value: true
            } as SwitchSetting,
        }
    },
    {
        name: "File Watcher",
        settings: {
            wddwwd: {
                name: "Watch Folder",
                note: "Directory that should be watched for new SingleFile pages.",
                type: "file",
                value: ""
            } as FileSetting,
            dwwdw: {
                name: "Should Watch",
                note: "Whether the file watcher should be active.",
                type: "switch",
                value: false
            } as SwitchSetting,
        }
    }
];

// type AllIds = typeof config[number]["settings"][number]["id"];
// type AllValues = typeof config[number]["settings"][number]["value"];

// type CAllIds = keyof typeof configo[number]["settings"];
// type CAllValues = typeof configo[number]["settings"][CAllIds]["value"];

type sext = Record<string, FileSetting | SwitchSetting | TextSetting>;

type SetDat<Type> = {
    [k in keyof Type]: Type[k] extends Setting ? Type[k]["value"] : undefined;
}

type SSD = SetDat<typeof configo[number]["settings"]>;

const test: SSD = {
    shouldWatch: false,
    watchFolder: "7"
};
console.log(test);

type idk = keyof typeof configo[number]["settings"];

export interface SSettingsCategory {
    name: string;
    note?: string;
    settings: Record<idk, TextSetting | SwitchSetting | FileSetting | undefined>;
}

type SSetDat<Type extends Record<number, SSettingsCategory>> = {
    [k in idk]: NonNullable<Type[number]["settings"][k]>["value"];
}

// @ts-expect-error stupid
export type SSDD = SSetDat<typeof configo>;

const ttest: SSDD = {
    shouldWatch: false,
    watchFolder: "7"
};
console.log(ttest);

export default config;