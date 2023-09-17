import {render as mount} from "solid-js/web";

import BrowserWindow, {BrowserTab} from "./browser.jsx";
import DropZone from "./dropzone.jsx";
import Settings from "./settings.jsx";
// import {Tabs, Tab} from "./tabs.jsx";

function Panel() {

    return <BrowserWindow>
            <BrowserTab title="Import Files" path="import" icon={<i class="bx bxs-file-import" />}><DropZone /></BrowserTab>
            {/* <BrowserTab title="Import History" path="history" icon={<i class="bx bx-history" />}>Something!</BrowserTab> */}
            <BrowserTab title="SingleFile Settings" path="settings" icon={<i class="bx bxs-cog" />}><Settings /></BrowserTab>
        </BrowserWindow>;
}

export function render() {
    const root = document.getElementById("render-note-root")!;
    const target = root.parentElement!;
    root.remove();
    mount(() => <Panel />, target);
}