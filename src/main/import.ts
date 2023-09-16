// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import template from "../../static/template.html";
import fs from "fs";
import path from "path";
import setupNotes from "./backend.js";


const htmlTitleRegex = /<title>(.+?)<\/title>/;
const fileTitleRegex = /^(.*) \(.*\)\.html$/;

export default async function checkAndImport(file: string) {
    const filename = path.basename(file);
    if (!filename.endsWith(".html")) return;
    const content = fs.readFileSync(file).toString();
    if (!content.includes("Page saved with SingleFile")) return;


    // Extract url and date from the SingleFile comment
    let url = "", date = "";
    const lines = content.split("\n");
    for (const l of lines) {
        const line = l.trim();
        if (line.startsWith("url: ")) url = line.replace("url:", "").trim();
        if (line.startsWith("saved date: ")) date = line.replace("saved date:", "").trim();
    }


    // Extract the page title from the html if possible
    // with fallback to extract from filename with
    // fallback to just filename minus ".html"
    let title = filename.replace(".html", "");
    const htmlMatch = content.match(htmlTitleRegex);
    if (htmlMatch && htmlMatch.length === 2) title = htmlMatch[1];
    if (!htmlMatch) {
        const fileMatch = filename.match(fileTitleRegex);
        if (fileMatch && fileMatch.length === 2) title = fileMatch[1];
    }

    await api.runOnBackend(setupNotes, [title, url, date, content, (template as string).replace("{url}", url)]);
}