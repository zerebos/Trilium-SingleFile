void (async () => {
    /** @type {HTMLIFrameElement} */
    const iframe = document.querySelector("#browser-window #iframe-target");
    if (!iframe) return;
    
    const scroller = $(iframe).parents(".note-book-content, .scrolling-container");
    if (scroller.length) {
        const height = scroller[0].scrollHeight;
        const win = $(iframe).parents("#browser-window")[0];
        const header = win.querySelector(".browser-header");
        /** @type {HTMLDivElement} */
        const body = win.querySelector(".browser-body");
        const margin = parseFloat(getComputedStyle(win).margin.replace("px", ""));
        const border = parseFloat(getComputedStyle(body).borderTopWidth.replace("px", ""));
        body.style.minHeight = `${height - header.offsetHeight - (margin * 2) - (border * 2)}px`;
    }

    iframe.id = ""; // Ensure splits don't override each other
    iframe.addEventListener("load", () => {
        // iframe.style.height = `${iframe.contentDocument.scrollingElement.scrollHeight}px`;
    });

    const address = document.querySelector("#browser-window #address-target");
    address.id = "";
    const currentNote = api.getActiveContextNote();
    address.textContent = currentNote.getLabelValue("url");
    const children = await currentNote.getChildNotes();
    let target = children.find(n => n.hasLabel("singleFileSource"));
    if (!target) {
        const dataTarget = $(iframe).parents(`[data-note-id]`);
        if (dataTarget.length) {
            const targetNote = await api.getNote(dataTarget[0].dataset.noteId);
            if (targetNote) {
                const targetChildren = await targetNote.getChildNotes();
                target = targetChildren.find(n => n.hasLabel("singleFileSource"));
            }
        }
    }
    
    if (target?.noteId) iframe.src = `api/notes/${target.noteId}/open`;
    else iframe.srcdoc = `<a href="https://github.com/rauenzi/Trilium-SingleFile" target="_blank">Something went wrong, please report this incident on GitHub!</a>`;
})();