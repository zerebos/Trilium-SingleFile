import fs from "fs";
import path from "path";


declare global {
    interface Window { singleFileWatcher?: fs.FSWatcher; }
}

const timeCache: Record<string, number> = {};
const isSystemError = (err: unknown): err is NodeJS.ErrnoException => "code" in (err as object);

export default function startWatcher<T extends (f: string) => Promise<void>>(dir: string, callback: T) {
    if (window.singleFileWatcher) {
        window.singleFileWatcher.close();
        delete window.singleFileWatcher;
    }

    const watcher = fs.watch(dir, {persistent: false});
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watcher.on("change", async (eventType, filename) => {
        if (eventType !== "rename" || !filename) return;
        if (!filename.toString().endsWith(".html")) return;

        // Attempt to wait for final save
        await new Promise(r => setTimeout(r, 100));


        const absolutePath = path.join(dir, filename.toString());
        try {

            // Perform some sanity checks
            const stats = fs.statSync(absolutePath);
            if (!stats.isFile()) return;
            if (!stats?.mtime?.getTime()) return;
            if (typeof(stats.mtime.getTime()) !== "number") return;
            if (timeCache[filename.toString()] == stats.mtime.getTime()) return;
            timeCache[filename.toString()] = stats.mtime.getTime();

            // Finally attempt to import
            await callback(absolutePath);
        }
        catch (err) {
            // Some really unknown error
            if (!isSystemError(err)) return;

            // Some unknown error
            if (err.code !== "ENOENT" && !err?.message.startsWith("ENOENT")) return;

            // Getting here means deleted, currently unused.
        }
        
    });

    window.singleFileWatcher = watcher;

    return watcher;
}
