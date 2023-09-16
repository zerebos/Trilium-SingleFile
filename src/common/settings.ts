let settingsNote = await getSettingsNote();

async function getSettingsNote() {
    const parentIds = api.currentNote.getParentNoteIds();
    if (parentIds.length > 1) {
        return api.showMessage("Trilium SingleFile has multiple parents, note that this is currently unsupported.");
    }

    const parent = await api.getNote(parentIds[0]);
    const siblings = await parent.getChildNotes();
    const settings = siblings.find(n => n.type === "code" && n.mime === "application/json");
    if (!settings) {
        return api.showError("Trilium SingleFile could not find settings note, you may need to reinstall this addon.");
    }

    return settings;
}


async function getSettings(): Promise<Record<string, string>> {
    if (!settingsNote) settingsNote = await getSettingsNote();
    if (!settingsNote) return {};

    const content = await settingsNote.getContent();
    try {
        return JSON.parse(content) as Record<string, string>;
    }
    catch {
        api.showError("Trilium SingleFile settings note seems to be corrupt.");
        return {};
    }
}


export {getSettingsNote, getSettings};