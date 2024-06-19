import SettingGroup from "./settings/group.jsx";
import SettingItem from "./settings/item.jsx";

import fixPageUrl from "../updates/pageurl.js";
import fixRenderNote from "../updates/rendernote.js";


function fixPageUrlClick() {
    void fixPageUrl();
}

function fixRenderNoteClick() {
    void fixRenderNote();
}

export default function AdvancedSettings() {

    return <SettingGroup name="Advanced" note="This section is for actions that should not be taken often.">
                <SettingItem inline={true} name="Fix #pageUrl Attributes" note="Old versions of this plugin used the #url attribute instead of the #pageUrl attribute. Clicking this button swaps #url for #pageUrl for all #singleFilePreview.">
                    <button class="setting-runner" onClick={fixPageUrlClick}><i class="bx bx-play-circle" />Run</button>
                </SettingItem>
                <SettingItem inline={true} name="Update ~renderNote Attribute" note="After updating this plugin, existing SingleFile notes will still point at the old ~renderNote. Clicking this button fixes this for all #singleFilePreview.">
                    <button class="setting-runner" onClick={fixRenderNoteClick}><i class="bx bx-play-circle" />Run</button>
                </SettingItem>
            </SettingGroup>;
}