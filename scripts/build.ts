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
    "ui.js": process.env.UI_NOTE_ID,
    "main.js": process.env.MAIN_NOTE_ID
};

const triliumPlugin: esbuild.Plugin = {
    name: "Trilium",
    setup(build) {
        build.onEnd(async result => {
            if (!result.metafile) return;

            const bundles = Object.keys(result.metafile.outputs);
            for (const bundle of bundles) {
                const filename = path.basename(bundle);
                const noteId = bundleMap[filename as keyof typeof bundleMap];
                if (!noteId) {
                    console.info(`No note id found for bundle ${bundle}`);
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

const cssMap = {
    "ui.js": {
        styles: "dist/styles.css"
    }
};

const bundleRaw: esbuild.Plugin = {
    name: "BundleRaw",
    setup(build) {
        build.onEnd(result => {
            if (!result.metafile) return;

            const bundles = Object.keys(result.metafile.outputs);
            for (const bundle of bundles) {
                const filename = path.basename(bundle);
                const mapping = cssMap[filename as keyof typeof cssMap];
                if (!mapping) {
                    console.info(`No mapping found for bundle ${bundle}`);
                    continue;
                }

                const bundlePath = path.join(rootDir, bundle);
                if (!fs.existsSync(bundlePath)) {
                    console.error(`Could not find bundle ${bundle}`);
                    continue;
                }

                let contents = fs.readFileSync(bundlePath).toString();
                for (const key in mapping) {
                    const other = fs.readFileSync(path.join(rootDir, mapping[key as keyof typeof mapping])).toString();
                    contents = contents.replace(`{${key}}`, other);
                }
                fs.writeFileSync(bundlePath, contents);
            }
            
        });
    }
};

const modules = ["ui", "main", "styles"];
const entryPoints: {in: string, out: string}[] = [];
const makeEntry = (mod: string) => ({"in": path.join(rootDir, "src", mod, mod === "styles" ? "index.css" : "index.ts"), "out": mod});

const modulesRequested = process.argv.filter(a => a.startsWith("--module="));
for (const mod of modulesRequested) {
    const module = mod?.replace("--module=", "") ?? "";
    if (modules.includes(module)) entryPoints.push(makeEntry(module));
}

if (!entryPoints.length) for (const mod of modules) entryPoints.push(makeEntry(mod));


const plugins = [bundleRaw, triliumPlugin];
if (entryPoints.find(e => e.out === "ui")) plugins.push(solidPlugin());

async function runBuild() {
    const before = performance.now();
    await esbuild.build({
        entryPoints: entryPoints,
        bundle: true,
        outdir: path.join(rootDir, "dist"),
        format: "cjs",
        external: ["fs", "path", "electron", "@electron/remote"],
        banner: {js: "const require = mod => {try{return window.require(mod);}catch{return {};}};"},
        target: ["chrome96", "node16"],
        loader: {
            ".png": "dataurl",
            ".gif": "dataurl",
            ".woff": "dataurl",
            ".woff2": "dataurl",
            ".ttf": "dataurl",
            ".html": "text",
            ".css": "css"
        },
        plugins: plugins,
        logLevel: "info",
        metafile: true,
        minify: process.argv.includes("--minify")
    });
    const after = performance.now();
    console.log(`Build actually took ${(after - before).toFixed(2)}ms`);
}

runBuild().catch(console.error);
