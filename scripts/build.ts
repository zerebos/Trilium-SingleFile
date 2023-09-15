import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import "dotenv/config";
import tepi from "trilium-etapi";
import * as esbuild from "esbuild";
import {solidPlugin} from "esbuild-plugin-solid";


const __dirname = path.dirname(fileURLToPath(import.meta.url));


// esbuild src/index.js --target=es2019 --format=cjs --loader:.png=dataurl
// --loader:.gif=dataurl --loader:.woff=dataurl --loader:.woff2=dataurl
// --loader:.ttf=dataurl --bundle --outfile=dist/bundle.js

if (process.env.TRILIUM_ETAPI_TOKEN) tepi.token(process.env.TRILIUM_ETAPI_TOKEN);

const triliumPlugin: esbuild.Plugin = {
    name: "Trilium",
    setup(build) {
        build.onEnd(async result => {
            if (!result.metafile) return;
            const bundleFile = Object.keys(result.metafile.outputs)[0];
            // console.log(result.metafile?.outputs["dist/bundle.js"]);
            const contents = fs.readFileSync(path.join(__dirname, "..", bundleFile)).toString();
            if (!contents) return console.error("Something went wrong on end of build");
            if (!process.env.NOTE_ID) return console.error("NOTE_ID not provided");
            await tepi.putNoteContentById(process.env.NOTE_ID, contents);
        });
    }
};

async function runBuild() {
    return await esbuild.build({
        entryPoints: [path.join(__dirname, "..", "src", "index.ts")],
        bundle: true,
        outfile: "dist/bundle.js",
        format: "cjs",
        target: ["es2019", "chrome96", "node16"],
        loader: {
            ".png": "dataurl",
            ".gif": "dataurl",
            ".woff": "dataurl",
            ".woff2": "dataurl",
            ".ttf": "dataurl",
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        plugins: [solidPlugin(), triliumPlugin],
        // logLevel: "verbose",
        metafile: true,
        minify: true
    });
}

runBuild().then(console.log).catch(console.error);
