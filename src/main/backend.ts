import {BackendAPI} from "trilium/backend";

declare const api: BackendAPI;

export default function setupNotes(title: string, url: string, date: string, singleFile: string, template: string) {
    const inbox = api.searchForNote("#singleFileInbox") ?? api.getTodayNote();
    if (!inbox) return;
    
    // Create the note tree for rendering the page
    const renderNote = api.createNewNote({parentNoteId: inbox.noteId, type: "render", title: title, content: "", isExpanded: false});
    const templateNote = api.createNewNote({parentNoteId: renderNote.note.noteId, type: "code", mime: "text/html", title: "SingleFile Renderer", content: ""});
    const htmlNote = api.createNewNote({parentNoteId: renderNote.note.noteId, type: "code", mime: "text/html", title: "SingleFile Page", content: singleFile});

    // Set some important labels
    templateNote.note.setLabel("archived");
    htmlNote.note.setLabel("archived");
    renderNote.note.setRelation("renderNote", templateNote.note.noteId);
    renderNote.note.setLabel("url", url);
    renderNote.note.setLabel("savedDate", date);
    renderNote.note.setLabel("title", title);
    
    // Set template content
    templateNote.note.setContent(template.replace("{noteId}", htmlNote.note.noteId));
}