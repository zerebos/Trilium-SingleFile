import {For, Match, Switch, createSignal} from "solid-js";

import queue from "./stores/queue.js";


export default function DropZone() {
    const {getFiles, importFile} = queue;
    const [dragCount, setDragCount] = createSignal<number>(0);
    // const [message, setMessage] = createSignal<string>("Drop Your Files Here!");
    // const [files, setFiles] = createSignal<string[]>([]);

    function dropHandler(ev: DragEvent) {
        setDragCount(0);
        if (!ev.dataTransfer?.files.length) return;

        ev.preventDefault();
        ev.stopPropagation();

        const items = Array.from(ev.dataTransfer.files);
        // const filtered = items.filter(i => i.kind === "file").map(f => f.getAsFile()?.name ?? "").filter(f => f);
        const filtered = items.map(f => f.path);
        // setFiles(filtered);
        // for (const f of filtered) ipcRenderer.invoke(ipc.IMPORT, f).catch(console.error);
        for (const f of items) void importFile(f);
    }

    function dragHandler(ev: DragEvent) {
        if (!ev.dataTransfer?.items.length) return;
        setDragCount(ev.dataTransfer.items.length);
        // setMessage(`Drop ${ev.dataTransfer?.items.length} files here!`);
    }

    function reset() {
        setDragCount(0);
        // setMessage("Drop Your Files Here!");
    }

    function message() {
        if (dragCount() > 0) return `Drop ${dragCount()} file${dragCount() > 1 ? "s" : ""} here!`;
        return "Drop files here to import!";
    }

    return <div class="import-files">
                <div class="drop-zone" classList={{active: dragCount() > 0}} onDrop={dropHandler} onDragEnter={dragHandler} onDragLeave={reset}>
                    {message()}
                </div>
                {getFiles().length === 0 ? undefined 
                : <div class="import-list">
                    <For each={getFiles()}>
                    {(_, index) => {
                        return <div class="import-item">
                            <div class="import-status">
                                <Switch>
                                    <Match when={getFiles()[index()].status === "queued"}><i class="bx bx-loader-circle" /></Match>
                                    <Match when={getFiles()[index()].status === "imported"}><i class="bx bxs-badge-check" /></Match>
                                    <Match when={getFiles()[index()].status === "error"}><i class="bx bxs-error-circle" /></Match>
                                    <Match when={getFiles()[index()].status === "invalid"}><i class="bx bxs-error" /></Match>
                                </Switch>
                                </div>
                            <div class="import-name">{getFiles()[index()].file.name}</div>
                        </div>;
                    }}
                    </For>
                </div>
                }
            </div>;
}
