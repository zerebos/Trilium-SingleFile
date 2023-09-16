import {app} from "@electron/remote";

export default {
    titleTemplate: "{pageTitle}",
    watchFolder: app.getPath("downloads")
};