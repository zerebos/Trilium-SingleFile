import {ParentProps} from "solid-js";


interface GroupProps extends ParentProps {
    name: string;
    note?: string;
}

export default function SettingGroup(props: GroupProps) {

    return <div class="setting-group">
        <div class="setting-group-title">{props.name}</div>
        {props.note && <div class="setting-group-note">{props.note}</div>}
        <div class="setting-group-list">{props.children}</div>
    </div>;
}