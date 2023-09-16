import {render} from "solid-js/web";
import {createSignal, onMount, For} from "solid-js";
import {getDefaults, getSettings, SettingsType} from "../common/settings.js";

function HelloWorld() {
    const [settings, setSettings] = createSignal(getDefaults());

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onMount(async () => {
        setSettings(await getSettings());
    });

    return <div>
        <ul>
            <For each={Object.keys(settings())} fallback={<p>Loading...</p>}>
                {key =>
                    <li>{key}: {settings()[key as keyof SettingsType].toString()}</li>
                }
            </For>
        </ul>
    </div>;
}

export default (): void => {
    render(() => <HelloWorld />, document.getElementById("render-note-root")!);
};