import backend from "./rendernote-backend.js";

export default async function fixRenderNote() {
    const notes = await api.searchForNotes("#singleFilePreview");
    const ids = notes.map(n => n.noteId);

    api.showMessage(`Updating ~renderNote for ${ids.length} notes...`);

    const error = await api.runOnBackend(backend, ids);

    if (error) api.showError(error.message);
    else api.showMessage(`Successfully updated ~renderNote for ${ids.length} notes!`);
}