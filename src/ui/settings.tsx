import {createSignal, onMount, For} from "solid-js";
import {getDefaults, getSettings} from "../common/settings.js";

import config from "../common/config.js";

import Switch from "./settings/switch.jsx";
import Text from "./settings/text.jsx";
import SettingGroup from "./settings/group.jsx";
import SettingItem from "./settings/item.jsx";
import FileInput from "./settings/file.jsx";
import {Dynamic} from "solid-js/web";


export default function Settings() {
    // const [settings, setSettings] = createSignal(getDefaults());

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    // onMount(async () => {
    //     setSettings(await getSettings());
    // });

    return <div class="settings-panel">
                <For each={config}>
                {(category) => {
                    return <SettingGroup name={category.name} note={category.note}>
                        <For each={category.settings}>
                            {(setting) => {
                                let component = () => <span>No clue why this is here</span>;
                                if (setting.type === "switch") component = () => <Switch initial={setting.value} />;
                                if (setting.type === "text") component = () => <Text initial={setting.value} />;
                                // if (setting.type === "file") component = () => <FileInput initial={setting.value} directory={setting.directory} />;
                                if (setting.type === "file") return undefined;
                                return <SettingItem name={setting.name} note={setting.note} inline={setting.type === "text" || setting.type === "switch"}>
                                    <Dynamic component={component} />
                                </SettingItem>;
                            }}
                        </For>
                    </SettingGroup>;
                }}
            </For>
        </div>;
}