import {ipcRenderer} from "electron";
import {createSignal, createRoot} from "solid-js";
import ipc from "../../common/ipc.js";

interface QueuedFile {
    file: File;
    status: "queued" | "imported" | "error" | "invalid";
}

function createQueue() {
    const [getFiles, setQueue] = createSignal<QueuedFile[]>([], {equals: false});

    async function importFile(file: File) {
        if (!file.name.endsWith(".html")) return setQueue(f => [...f, {file, status: "invalid"}]);
        const content = await file.text();
        if (!content.includes("Page saved with SingleFile")) return setQueue(f => [...f, {file, status: "invalid"}]);
        setQueue(f => [...f, {file, status: "queued"}]);
        try {
            await ipcRenderer.invoke(ipc.IMPORT, file.name, content);
        }
        catch {
            setQueue(files => {
                const qFile = files.find(f => f.file.name === file.name);
                if (!qFile) return files; // Uh oh, should handle this better
                qFile.status = "error";
                return [...files];
            });
        }
        await new Promise(r => setTimeout(r, 1000));
        // setTimeout(() => {
            setQueue(files => {
                const qFile = files.find(f => f.file.name === file.name);
                // console.log(qFile);
                if (!qFile) return files; // Uh oh, should handle this better
                qFile.status = "imported";
                return [...files];
                // const index = files.findIndex(f => f.file.name === file.name);
                // if (index < 0) return files; // Uh oh, should handle this better
                // const removed = files.splice(index, 1);
                // removed[0].status = "imported";
                // return [...files, removed[0]];
            });
        // }, 1000);
        
        // setTimeout(() => {
        //     setQueue(files => {
        //         const index = files.findIndex(f => f.name === file.name);
        //         if (index < 0) return files; // Uh oh, should handle this better
        //         files.splice(index, 1);
        //         return [...files];
        //     });
        // }, 1000);

    }

    return {getFiles, importFile};
}

export default createRoot(createQueue);