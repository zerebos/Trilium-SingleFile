import {ParentProps} from "solid-js";


interface ItemProps extends ParentProps {
    name: string;
    note: string;
    inline?: boolean;
}

export default function SettingItem(props: ItemProps) {

    return <div class="setting-item" classList={{inline: props.inline}}>
        <div class="setting-title">
            <div class="setting-name">{props.name}</div>
            {props.inline && props.children}
        </div>
        {!props.inline && props.children}
        <div class="setting-note">{props.note}</div>
        <div class="setting-divider" />
    </div>;
}