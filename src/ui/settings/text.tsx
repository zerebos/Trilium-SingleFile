import {createSignal, ParentProps} from "solid-js";


export default function Text(props: ParentProps<{initial: string, onChange?: (value: string) => void}>) {
    const [value, setValue] = createSignal(props.initial); // eslint-disable-line solid/reactivity

    function change(ev: Event) {
        if (!ev?.target) return;
        const newValue = (ev.target as HTMLInputElement).value;
        props.onChange?.(newValue);
        setValue(newValue);
    }

    return <input class="text-input" type="text" onChange={change} value={value()} />;
}