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
1. Import the zip into Trilium, but make sure you uncheck `Safe Import`!


## Updating

Since every install of this plugin has a new renderer `html` and `js` (though there's not always guaranteed to be changes), there was some functionality added into the plugin to make migrating to new versions a little easier.

1. Install the new version using the steps from above
1. Delete the old version of the plugin
1. Open the plugins settings page
1. Scroll to the bottom
1. Click "Fix ~renderNote Attributes"

Once this is considered more stable, the plugin will prompt you with this as soon as you install so you don't have to remember to do it.


## Usage

- New imports are automatically placed into your `#singleFileInbox`
    - If there's no note with `#singleFileInbox` attribute then it uses `#inbox`
    - If there's no `#inbox` then it uses a daily note
- Use the UI to customize your settings at any time!
- All render notes will be given `#singleFilePreview`
- All SingleFile notes will be given `#singleFileSource`

### Import

1. Click on the render note called `Trilium SingleFile`
1. Drop any SingleFile pages in the drop zone

### File Watcher

1. Use the UI to change the folder to be watched
    - User downloads folder is used by default
1. Download a webpage using SingleFile


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