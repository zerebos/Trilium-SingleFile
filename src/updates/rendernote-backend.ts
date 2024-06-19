import {BackendAPI} from "trilium/backend";

declare const api: BackendAPI;


interface ErrorResult {
    message: string;
}


export default function fixRenderNote(...noteIds: string[]): ErrorResult | undefined {

    const templateNotes = api.searchForNotes("#triliumSingleFile=renderer");
    if (templateNotes.length > 1) return {message: "Too many SingleFile Renderers! Make sure you delete old ones first!"};
    if (templateNotes.length < 1) return {message: "Could not find the SingleFile Renderer! Make sure the plugin was installed correctly!"};

    const templateNote = templateNotes[0];
    
    for (const id of noteIds) {
        const note = api.getNote(id);
        if (!note) continue;

        api.log("Setting ~renderNote for " + note.noteId);
        note.setRelation("renderNote", templateNote?.noteId);
    }
}