import {createSignal, ParentProps} from "solid-js";


export default function FileInput(props: ParentProps<{initial: string, directory?: boolean, onChange?: (value: string) => void}>) {
    const [value, setValue] = createSignal(props.initial); // eslint-disable-line solid/reactivity

    function change(ev: Event) {
        if (!ev?.target) return;
        const newValue = (ev.target as HTMLInputElement).value;
        props.onChange?.(newValue);
        setValue(newValue);
    }

    /* @ts-expect-error webkitdirectory and directory are non-standard but necessary */
    return <input class="file-input" type="file" webkitdirectory={props.directory} directory={props.directory} onChange={change} value={value()} />;
}