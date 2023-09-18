import ipc from "./ipc.js";

interface ImportDetails {
    name: string;
    content: string;
}

export class ImportEvent extends CustomEvent<ImportDetails> {
    constructor(name: string, content: string) {
        super(ipc.IMPORT, {detail: {name, content}});
    }
}