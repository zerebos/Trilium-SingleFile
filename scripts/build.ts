import fs from "node:fs";
import path from "node:path";
// import {fileURLToPath} from "node:url";

import dotenv from "dotenv";
import tepi from "trilium-etapi";
import * as esbuild from "esbuild";
import {solidPlugin} from "esbuild-plugin-solid";


// const fileURL = fileURLToPath(import.meta.url);
// let baseDir = path.dirname(fileURL);
// if (fileURL.includes("esrun-")) baseDir = path.join(baseDir, "..", "..", "scripts");
// const rootDir = path.join(baseDir, "..");
// console.log(process.env.npm_package_json);
const rootDir = path.dirname(process.env.npm_package_json!);


dotenv.config();
if (process.env.TRILIUM_ETAPI_TOKEN) tepi.token(process.env.TRILIUM_ETAPI_TOKEN);

const bundleMap = {
    ui: process.env.UI_NOTE_ID,
    main: process.env.MAIN_NOTE_ID
};

const triliumPlugin: esbuild.Plugin = {
    name: "Trilium",
    setup(build) {
        build.onEnd(async result => {
            if (!result.metafile) return;

            const bundles = Object.keys(result.metafile.outputs);
            for (const bundle of bundles) {
                const filename = path.basename(bundle);
                const name = filename.split(".")[0];
                const noteId = bundleMap[name as keyof typeof bundleMap];
                if (!noteId) {
                    console.error(`No note id found for bundle ${bundle}`);
                    continue;
                }

                const bundlePath = path.join(rootDir, bundle);
                if (!fs.existsSync(bundlePath)) {
                    console.error(`Could not find bundle ${bundle}`);
                    continue;
                }

                const contents = fs.readFileSync(bundlePath).toString();
                await tepi.putNoteContentById(noteId, contents);
            }
            
        });
    }
};

const modules = ["ui", "main"];
const entryPoints: {in: string, out: string}[] = [];
const makeEntry = (mod: string) => ({"in": path.join(rootDir, "src", mod, "index.ts"), "out": mod});

const moduleRequested = process.argv.find(a => a.startsWith("--module="))?.replace("--module=", "") ?? "";
if (modules.includes(moduleRequested)) {
    entryPoints.push(makeEntry(moduleRequested));
}
else {
    for (const mod of modules) entryPoints.push(makeEntry(mod));
}


const plugins = [triliumPlugin];
if (entryPoints.find(e => e.out === "ui")) plugins.push(solidPlugin());

async function runBuild() {
    const before = performance.now();
    await esbuild.build({
        entryPoints: entryPoints,
        bundle: true,
        outdir: path.join(rootDir, "dist"),
        format: "cjs",
        external: ["fs", "path", "electron", "@electron/remote"],
        banner: {js: "const require = window.require;"},
        target: ["chrome96", "node16"],
        loader: {
            ".png": "dataurl",
            ".gif": "dataurl",
            ".woff": "dataurl",
            ".woff2": "dataurl",
            ".ttf": "dataurl",
            ".html": "text",
        },
        plugins: plugins,
        logLevel: "info",
        metafile: true,
        minify: process.argv.includes("--minify"),
        platform: "node"
    });
    const after = performance.now();
    console.log(`Build actually took ${(after - before).toFixed(2)}ms`);
}

runBuild().catch(console.error);
