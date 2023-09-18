declare const glob: {
    isDesktop: () => boolean;
    isMobile: () => boolean;
};

function isDesktop() {
    if (typeof(window.require) !== "function") return false;
    try {
        const electron = window.require("electron");
        return !!electron.clipboard;
    }
    catch {
        return false;
    }
}


function isServer() {
    return !isDesktop() && glob.isDesktop();
}


function isMobile() {
    return glob.isMobile();
}


export {isDesktop, isServer, isMobile};