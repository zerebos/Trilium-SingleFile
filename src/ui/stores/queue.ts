import {ipcRenderer} from "electron";
import {createSignal, createRoot} from "solid-js";
import ipc from "../../common/ipc.js";

interface QueuedFile {
    id: string;
    file: File;
    status: "queued" | "imported" | "error" | "invalid";
}

function createQueue() {
    const [getFiles, setQueue] = createSignal<QueuedFile[]>([], {equals: false});

    async function importFile(file: File) {
        const id = api.randomString(12);
        if (!file.name.endsWith(".html")) return setQueue(f => [...f, {id, file, status: "invalid"}]);
        const content = await file.text();
        if (!content.includes("Page saved with SingleFile")) return setQueue(f => [...f, {id, file, status: "invalid"}]);
        setQueue(f => [...f, {id, file, status: "queued"}]);
        try {
            await ipcRenderer.invoke(ipc.IMPORT, file.name, content);
        }
        catch {
            setQueue(files => {
                const qFile = files.find(f => f.id === id);
                if (!qFile) return files; // Uh oh, should handle this better
                qFile.status = "error";
                return [...files];
            });
        }
        await new Promise(r => setTimeout(r, 1000));
        setQueue(files => {
            const qFile = files.find(f => f.id === id);
            if (!qFile) return files; // Uh oh, should handle this better
            qFile.status = "imported";
            return [...files];

        });
    }

    return {getFiles, importFile};
}

export default createRoot(createQueue);