import {render as mount} from "solid-js/web";

import BrowserWindow, {BrowserTab} from "./browser.jsx";
import DropZone from "./dropzone.jsx";
import Settings from "./settings.jsx";
// import {Tabs, Tab} from "./tabs.jsx";

// Bundled later by a custom esbuild plugin because esbuild doesn't allow
// handling it the way I would want. I might move to text-loader at
// some point to make this feel less janky
const styles = `{styles}`; 

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
    // const cssNote = await api.searchForNote("#triliumSingleFile=css");
    // if (!cssNote) return api.showError("Could not find CSS note for Trilium SingleFile. You may need to reinstall this addon!");
    // const link = document.createElement("link");
    // link.rel = "stylesheet";
    // link.href = `api/notes/${cssNote.noteId}/open`;
    // target.append(link);
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    target.append(styleEl);
    
    mount(() => <Panel />, target);
}