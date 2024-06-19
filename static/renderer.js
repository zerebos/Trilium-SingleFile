/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */


/** @type {HTMLDivElement} */
const browser = document.querySelector("#browser-target");
if (!browser) return;
browser.id = ""; // Ensure splits don't override each other

/** @type {HTMLIFrameElement} */
const iframe = browser.querySelector("iframe");
const address = browser.querySelector(".address-bar");

// Try to automatically size to the space available then listen for size updates
// and adjust to those
//
// The reason for the setTimeout and other jankiness is to avoid looping
// the observer infinitely when we update the body's height
const scroller = $(browser).parents(".note-book-content, .scrolling-container");
if (scroller.length) {
    let previousHeight = 0;
    /** @type {ResizeObserverCallback} */
    const observer = (entries) => {
        const target = entries.find(e => e.target === scroller[0]);
        if (!target) return;

        const height = window.innerHeight - target.target.offsetTop;
        if (height === previousHeight) return;
        previousHeight = height;
        window.singleFileResizeObserver?.disconnect();

        const header = browser.querySelector(".browser-header");
        /** @type {HTMLDivElement} */
        const body = browser.querySelector(".browser-body");
        const margin = parseFloat(getComputedStyle(browser).margin.replace("px", ""));
        const border = parseFloat(getComputedStyle(body).borderTopWidth.replace("px", ""));
        body.style.minHeight = `${height - header.offsetHeight - (margin * 2) - (border * 2)}px`;
        setTimeout(() => {
            window.singleFileResizeObserver = new ResizeObserver(observer);
            window.singleFileResizeObserver.observe(scroller[0]);
        }, 1);
    };
    window.singleFileResizeObserver?.disconnect();
    window.singleFileResizeObserver = new ResizeObserver(observer);
    window.singleFileResizeObserver.observe(scroller[0]);
}

// Assume the current note is the render note
const currentNote = api.getActiveContextNote();
address.textContent = currentNote.getLabelValue("url") ?? currentNote.getLabelValue("pageUrl");
const children = await currentNote.getChildNotes();
let target = children.find(n => n.hasLabel("singleFileSource"));

// If it wasn't the render note, assume we are in a book or similar
const bookTarget = $(iframe).parents(`[data-note-id]`);
if (!target && bookTarget.length) {
    const targetNote = await api.getNote(bookTarget[0].dataset.noteId);
    if (targetNote) {
        const targetChildren = await targetNote.getChildNotes();
        target = targetChildren.find(n => n.hasLabel("singleFileSource"));
    }
}

// If all else fails, let the user know something went wrong
if (target?.noteId) iframe.src = `api/notes/${target.noteId}/open`;
else iframe.srcdoc = `<a href="https://github.com/rauenzi/Trilium-SingleFile" target="_blank">Something went wrong, please report this incident on GitHub!</a>`;
