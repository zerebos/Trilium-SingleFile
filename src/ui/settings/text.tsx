import {createSignal, ParentProps} from "solid-js";


interface TextInputProps<T> extends ParentProps {
    initial: string;
    onChange?: T;
    disabled?: boolean;
}

export default function TextInput<T extends (value: string) => void>(props: TextInputProps<T>) {
    const [value, setValue] = createSignal(props.initial); // eslint-disable-line solid/reactivity

    function change(ev: Event) {
        if (!ev?.target) return;
        const newValue = (ev.target as HTMLInputElement).value;
        props.onChange?.(newValue);
        setValue(newValue);
    }

    return <input class="text-input" type="text" onChange={change} value={value()} />;
}