import {dialog} from "@electron/remote";
import {createSignal, ParentProps} from "solid-js";


interface FileInputProps<T> extends ParentProps {
    initial: string;
    directory?: boolean;
    onChange?: T;
}

export default function FileInput<T extends (value: string) => void>(props: FileInputProps<T>) {
    const [value, setValue] = createSignal(props.initial); // eslint-disable-line solid/reactivity

    function browse() {
        // eslint-disable-next-line solid/reactivity
        void dialog.showOpenDialog({properties: ["openDirectory"]}).then(result => {
            if (result.canceled) return;
            const newPath = result.filePaths[0];
            props.onChange?.(newPath);
            setValue(newPath);
        });
    }

    return <div class="file-input-wrap">
        <button class="file-browse" onClick={browse}><i class="bx bxs-folder-open" />Browse</button>
        <input class="file-input" type="input" value={value()} readOnly={true} />
    </div>;
}