import {BackendAPI} from "trilium/backend";

declare const api: BackendAPI;

export default function setupNotes(title: string, url: string, date: string, singleFile: string, template: string) {
    const inbox = api.searchForNote("#singleFileInbox") ?? api.getTodayNote();
    if (!inbox) return;

    // Extract url and date from the SingleFile comment
    // let url, date;
    // const lines = singleFile.split("\n");
    // for (const l of lines) {
    //     const line = l.trim();
    //     if (line.startsWith("url: ")) url = line.replace("url:", "").trim();
    //     if (line.startsWith("saved date: ")) date = line.replace("saved date:", "").trim();
    // }

    // Extract the page title from the html if possible
    // with fallback to extract from filename with
    // fallback to just filename minus ".html"
    // let title = filename.replace(".html", "");
    // const htmlTitleRegex = /<title>(.*)<\/title>/;
    // const fileTitleRegex = /^(.*) \(.*\)\.html$/;
    // const htmlMatch = singleFile.match(htmlTitleRegex);
    // if (htmlMatch && htmlMatch.length === 2) title = htmlMatch[1];
    // if (!htmlMatch) {
    //     const fileMatch = filename.match(fileTitleRegex);
    //     if (fileMatch && fileMatch.length === 2) title = fileMatch[1];
    // }
    
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

// Brandon Routh - IMDb (9_14_2023 11_41_06 PM).html
// <!--
//  Page saved with SingleFile 
//  url: https://www.imdb.com/name/nm0746125/?ref_=ttfc_fc_cl_t72 
//  saved date: Thu Sep 14 2023 23:41:06 GMT-0400 (Eastern Daylight Time)
// -->