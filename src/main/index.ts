import {app, ipcMain} from "@electron/remote";

import checkAndImport from "./import.js";
import startWatcher from "./watcher.js";



ipcMain.removeHandler("singlefile-import");
ipcMain.handle("singlefile-import", (_, file) => checkAndImport(file as string));
// Call with await ipcRenderer.invoke("singlefile-import", fullpath);

startWatcher(app.getPath("downloads"), checkAndImport);