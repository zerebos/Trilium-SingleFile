import {For} from "solid-js";

import config, {FileSetting, SettingsData, SwitchSetting, TextSetting} from "../common/config.js";

import Switch from "./settings/switch.jsx";
import Text from "./settings/text.jsx";
import SettingGroup from "./settings/group.jsx";
import SettingItem from "./settings/item.jsx";
import FileInput from "./settings/file.jsx";
import {Dynamic} from "solid-js/web";

import settingsStore from "./stores/settings.js";


export default function Settings() {
    const {settings, updateSetting} = settingsStore;

    return <div class="settings-panel">
                <For each={config}>
                {(category) => {
                    return <SettingGroup name={category.name} note={category.note}>
                        <For each={Object.keys(category.settings)}>
                            {(key: keyof SettingsData) => {
                                const setting = category.settings[key] as (TextSetting | FileSetting | SwitchSetting);
                                let component = () => <span>No clue why this is here</span>;
                                if (setting.type === "switch") component = () => <Switch initial={settings()[key] as boolean} onChange={(value: boolean) => updateSetting(key, value)} />;
                                if (setting.type === "text") component = () => <Text initial={settings()[key] as string} onChange={(value: string) => updateSetting(key, value)} />;
                                if (setting.type === "file") component = () => <FileInput initial={setting.value} directory={setting.directory} onChange={(value: string) => updateSetting(key, value)} />;
                                // if (setting.type === "file") return undefined;
                                return <SettingItem name={setting.name} note={setting.note} inline={setting.type === "switch"}>
                                    <Dynamic component={component} />
                                </SettingItem>;
                            }}
                        </For>
                    </SettingGroup>;
                }}
            </For>
        </div>;
}