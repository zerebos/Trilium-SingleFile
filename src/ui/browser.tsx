import {ParentProps, children, Component, createSignal, For, JSXElement} from "solid-js";

export default function BrowserWindow(props: ParentProps) {
    const [activeTab, setActiveTab] = createSignal<number>(0);

    const tabs = children(() => props.children);
    const evaluatedTabs = () => tabs.toArray() as unknown as BrowserTabProps[];

    return <div class="browser-window">
                <div class="browser-header">
                    <div class="window-actions">
                        <span class="window-dot" style={{background: "rgb(242, 95, 88)"}} />
                        <span class="window-dot" style={{background: "rgb(251, 190, 60)"}} />
                        <span class="window-dot" style={{background: "rgb(88, 203, 66)"}} />
                    </div>
                    <div class="address-bar">
                        {"http://trilium-singlefile/" + evaluatedTabs()[activeTab()].path}
                    </div>
                    <div class="hamburger">
                        <span class="burger-bar" />
                        <span class="burger-bar" />
                        <span class="burger-bar" />
                    </div>
                </div>
                <div class="browser-tabs">
                    <For each={evaluatedTabs()}>
                        {({title, icon}, index) => (
                            <div classList={{"browser-tab": true, "active": activeTab() == index()}} onClick={() => setActiveTab(index())}>{icon ?? undefined}{title}</div>
                        )}
                    </For>
                </div>
                <div class="browser-body">
                    {evaluatedTabs()[activeTab()].children}
                </div>
            </div>;
}


interface BrowserTabProps {
    title: string;
    children: JSXElement;
    path: string;
    icon?: JSXElement;
}

export const BrowserTab: Component<BrowserTabProps> = (props) => {
    return props as unknown as JSXElement;
};