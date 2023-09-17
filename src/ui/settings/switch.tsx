import {createSignal, ParentProps} from "solid-js";


export default function Switch(props: ParentProps<{initial: boolean, onChange?: (value: boolean) => void}>) {
    const [isChecked, setChecked] = createSignal(props.initial); // eslint-disable-line solid/reactivity

    function toggle() {
        props.onChange?.(!isChecked());
        setChecked(!isChecked());
    }

    return <>
        {!isChecked() && <i class='bx bxs-toggle-left' style={{color: "#f25f58"}} onClick={toggle} />}
        {isChecked() && <i class='bx bxs-toggle-right' style={{color: "#58cb42"}} onClick={toggle} />}
    </>;
}