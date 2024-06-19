import backend from "./pageurl-backend.js";

export default async function fixPageUrl() {
    const notes = await api.searchForNotes("#singleFilePreview");
    const ids = notes.filter(n => n.getLabel("url")).map(n => n.noteId);
    
    api.showMessage(`Updating #url to #pageUrl for ${ids.length} notes...`);

    await api.runOnBackend(backend, ids);

    api.showMessage(`Successfully updated #url to #pageUrl for ${ids.length} notes!`);
}