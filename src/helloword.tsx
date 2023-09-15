import {render} from "solid-js/web";

function HelloWorld() {
    return <span>Hello world!</span>;
}

export default (): void => {
    render(() => <HelloWorld />, document.getElementById("render-note-root")!);
};