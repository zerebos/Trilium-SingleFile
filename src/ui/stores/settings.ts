import {createSignal, createRoot} from "solid-js";
import {SettingsData} from "../../common/config.js";
import {getDefaults, getSettings, updateSettings} from "../../common/settings.js";
import debounce from "../../common/debounce.js";


function createQueue() {
    const [settings, setSettings] = createSignal<SettingsData>(getDefaults());

    void getSettings().then(s => {
        setSettings(s);
    });

    async function updateSetting(id: keyof SettingsData, value: SettingsData[keyof SettingsData]) {
        await updateSettings({[id]: value});
        setSettings((s: SettingsData) => {
            (s as Record<keyof SettingsData, SettingsData[keyof SettingsData]>)[id] = value;
            return {...s};
        });
    }

    return {settings, updateSetting: debounce(updateSetting, 50)};
}

export default createRoot(createQueue);