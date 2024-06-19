import {BackendAPI} from "trilium/backend";

declare const api: BackendAPI;


export default function fixPageUrl(...noteIds: string[]) {
    for (const id of noteIds) {
        const note = api.getNote(id);
        if (!note) continue;

        const currentUrl = note.getLabelValue("url");
        if (!currentUrl) continue;
        
        api.log("Setting #pageUrl for " + note.noteId);
        note.addLabel("pageUrl", currentUrl);
        note.removeLabel("url");
    }
}