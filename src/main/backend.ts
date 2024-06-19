import {BackendAPI} from "trilium/backend";

declare const api: BackendAPI;

interface RenderAttributes {
    title: string;
    pageUrl: string;
    date: string;
    iconClass: string;
}

export default function setupNotes(singleFile: string, attrs: RenderAttributes) {
    const inbox = api.searchForNote("#singleFileInbox") ?? api.searchForNote("#inbox") ?? api.getTodayNote();
    if (!inbox) return;
    
    // Create the note tree for rendering the page
    const renderNote = api.createNewNote({parentNoteId: inbox.noteId, type: "render", title: attrs.title, content: "", isExpanded: false});
    // api.createNewNote({parentNoteId: renderNote.note.noteId, type: "code", mime: "text/html", title: "SingleFile Renderer", content: ""});
    const templateNote = api.searchForNote("#triliumSingleFile=renderer");
    const htmlNote = api.createNewNote({parentNoteId: renderNote.note.noteId, type: "code", mime: "text/html", title: "SingleFile Page", content: singleFile});

    // Set some important labels
    htmlNote.note.setLabel("archived");
    htmlNote.note.setLabel("singleFileSource");
    if (templateNote) renderNote.note.setRelation("renderNote", templateNote.noteId);
    renderNote.note.setLabel("singleFilePreview");
    for (const attr in attrs) {
        if (!attrs[attr as keyof RenderAttributes]) continue;
        renderNote.note.setLabel(attr, attrs[attr as keyof RenderAttributes]);
    }
}