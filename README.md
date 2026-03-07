# Trilium-SingleFile
An addon for [Trilium Notes](https://github.com/zadam/trilium) to easily import [SingleFile](https://github.com/gildas-lormeau/SingleFile) html pages.

Note: Due to the non-standard APIs and globals used, consider this addon in beta. I expect many issues to be found.

## Preview
<!-- https://raw.githubusercontent.com/rauenzi/Trilium-SingleFile/blob/main/LICENSE -->
https://github.com/zadam/trilium/assets/6865942/8f6dd790-18ac-49bb-b494-247cd8edfa30


## Features

- Easily import SingleFile pages via drag and drop
- SingleFile pages are saved in Trilium unedited
- Preview them directly in Trilium with a fancy pseudo-browser UI
- Fancy in-app settings UI
- Multiple settings and customization

### Desktop

There are some features specific to the desktop client of Trilium.
- Watch a local folder for newly added SingleFile pages
- Customize which folder to watch as well as a toggle to enable/disable


## Installation

1. Download the `zip` file from the [latest release](https://github.com/rauenzi/Trilium-SingleFile/releases/latest) on GitHub.
1. In Trilium, right-click the note where you want to install the plugin and choose **Import into note**.
1. Select the downloaded `zip` file, **uncheck `Safe Import`**, and click **Import**.
   > ⚠️ `Safe Import` must be disabled because the plugin uses custom JavaScript that Trilium would otherwise strip out.

After importing, you will see a new note called **Trilium SingleFile** in your note tree. This note is a [render note](https://github.com/zadam/trilium/wiki/Note-types#render-note) — it contains the plugin UI and acts as the main entry point.

### Enabling the plugin (newer Trilium versions)

> ⚠️ Trilium 0.63+ automatically adds a `#disabled` label to imported scripts and render notes as a security measure. If the plugin UI does not appear when you click the **Trilium SingleFile** note, you need to remove this label from the following notes.

> 💡 The plugin's child notes (`Main JS`, `Settings`, etc.) are hidden by default because they are tagged `#archived`. To see them, enable **Show archived notes** in Trilium's left panel, or expand the **Trilium SingleFile** note in the tree.

1. In your note tree, click **Trilium SingleFile** (the root plugin note).
   - Open its **Owned Attributes** (click the `</>` button on the toolbar, or press <kbd>Alt+A</kbd>).
   - Find the `#disabled` label and delete it.
1. Expand **Trilium SingleFile** and click **Main JS** (the JavaScript child note tagged `#triliumSingleFile=main`).
   - Open its **Owned Attributes** the same way.
   - Find the `#disabled` label and delete it.
1. Click **Settings** (the child note tagged `#triliumSingleFile=settings`).
   - Remove the `#disabled` label from its **Owned Attributes** as well.
1. Reload the **Trilium SingleFile** note — the plugin UI should now appear.

### How it works

The plugin creates the following note structure automatically (all child notes are hidden with `#archived`):

```
Trilium SingleFile          ← render note (plugin entry point, tagged #triliumSingleFile=ui)
│                             ~renderNote → UI HTML
├── Settings                ← plugin settings store (#triliumSingleFile=settings, #run:frontendStartup)
├── Main JS                 ← plugin logic (#triliumSingleFile=main, #run:frontendStartup)
├── UI HTML                 ← render template for the plugin UI (#triliumSingleFile=ui.html)
│   └── UI JS               ← UI JavaScript (#triliumSingleFile=ui.js)
└── Renderer HTML           ← render template for saved pages (#triliumSingleFile=renderer)
    └── Renderer JS         ← renderer JavaScript (#triliumSingleFile=renderer.js)
```

When you import a SingleFile page, the plugin automatically creates:

```
<your inbox note>
└── <Page Title>            ← render note (tagged #singleFilePreview)
                              ~renderNote → Renderer HTML
    └── SingleFile Page     ← raw HTML source (tagged #singleFileSource, hidden with #archived)
```

The plugin uses two different `~renderNote` relations:
- The root **Trilium SingleFile** note's `~renderNote` points to **UI HTML** — this renders the plugin's own drag-and-drop interface.
- Each imported page's `~renderNote` points to **Renderer HTML** — this is what displays the saved page in the pseudo-browser UI.

**You do not need to create either relation manually** — the plugin sets them automatically.

### Setting up an inbox (optional)

By default, imported pages are placed into a **daily note**. To organize imports into a specific note instead:

1. Open the note you want to use as your inbox in Trilium.
1. Add a label attribute `#singleFileInbox` to that note (click **+** in the note's attribute panel, choose **Label**, and enter `singleFileInbox`).

The plugin will then place all new imports as children of that note. If no `#singleFileInbox` note is found, it falls back to a note labelled `#inbox`, and then to the current daily note.


## Updating

Since every install of this plugin has a new renderer `html` and `js` (though there's not always guaranteed to be changes), there was some functionality added into the plugin to make migrating to new versions a little easier.

1. Install the new version using the steps from above.
1. Delete the old version of the plugin note.
1. Open the new **Trilium SingleFile** note.
1. Scroll to the bottom of the plugin UI.
1. Click **"Fix ~renderNote Attributes"**.

This re-points the `~renderNote` relation on all your existing saved pages to the new renderer. Until this is done, previously saved pages may not render correctly.

Once this is considered more stable, the plugin will prompt you with this as soon as you install so you don't have to remember to do it.


## Usage

- New imports are automatically placed into your `#singleFileInbox`
    - If there's no note with `#singleFileInbox` attribute then it uses `#inbox`
    - If there's no `#inbox` then it uses a daily note
- Use the UI to customize your settings at any time!
- All render notes will be given `#singleFilePreview`
- All SingleFile notes will be given `#singleFileSource`

### Labels reference

| Label | Applied to | Purpose |
|---|---|---|
| `#singleFileInbox` | Any note you choose | Designates the inbox note for new imports |
| `#singleFilePreview` | Each imported page's render note | Lets you search/find all saved pages |
| `#singleFileSource` | The raw HTML child note | Marks the source HTML; also tagged `#archived` so it stays hidden |
| `#archived` | All plugin child notes & raw HTML source notes | Hides notes from the note tree by default |
| `#triliumSingleFile=ui` | The root **Trilium SingleFile** note | Internal — entry point for the plugin UI |
| `#triliumSingleFile=settings` | The **Settings** child note | Internal — stores your saved settings |
| `#triliumSingleFile=main` | The **Main JS** child note | Internal — plugin logic with `#run:frontendStartup` |
| `#triliumSingleFile=ui.html` | The **UI HTML** child note | Internal — HTML template for the plugin's drag-and-drop UI |
| `#triliumSingleFile=ui.js` | The **UI JS** child note | Internal — JavaScript for the plugin UI |
| `#triliumSingleFile=renderer` | The **Renderer HTML** child note | Internal — render template used by every imported page |
| `#triliumSingleFile=renderer.js` | The **Renderer JS** child note | Internal — JavaScript for the page renderer |

### Import

1. Click on the render note called **Trilium SingleFile** in your note tree.
1. The plugin UI opens in the main pane — you will see a drop zone.
1. Drag and drop any SingleFile `.html` page into the drop zone.

> **Saving pages with SingleFile:** Install the [SingleFile browser extension](https://github.com/gildas-lormeau/SingleFile#install), then click its icon on any page to save a self-contained `.html` file. That file is what you drag into the plugin.

### File Watcher (desktop only)

1. Open the **Trilium SingleFile** note and go to settings.
1. Enable the file watcher and set the folder to watch (defaults to your Downloads folder).
1. Save a webpage using the SingleFile browser extension — the file will be automatically imported once detected in the watched folder (detection may take a few moments).


## Links

Check out my other Trilium-based projects:
- [Trilium Markdown Preview](https://github.com/rauenzi/Trilium-MarkdownPreview)
- [Trilium LaTeX Preview](https://github.com/rauenzi/Trilium-LaTeXPreview)
- [Trilium Breadcrumbs](https://github.com/rauenzi/Trilium-Breadcrumbs)
- [Trilium SingleFile](https://github.com/rauenzi/Trilium-SingleFile)
- [Trilium Types](https://github.com/rauenzi/trilium-types)
- [Trilium ETAPI](https://github.com/rauenzi/trilium-etapi)
- [Trilium Pack](https://github.com/rauenzi/trilium-pack)

Want more? Be sure to check out the [Awesome Trilium](https://github.com/Nriver/awesome-trilium) list!