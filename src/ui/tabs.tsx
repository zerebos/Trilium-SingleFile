import {children, Component, createSignal, For, JSXElement} from "solid-js";

interface TabsProps {
    children: JSXElement
}

export const Tabs: Component<TabsProps> = (props) => {
    const [activeTab, setActiveTab] = createSignal<number>(0);

    const tabs = children(() => props.children);
    const evaluatedTabs = () => tabs.toArray() as unknown as TabProps[];

    return (
        <div>
            <ul>
                <For each={evaluatedTabs()}>
                    {({title}, index) => (
                        <li>
                            <button onClick={() => setActiveTab(index())}>{title}</button>
                        </li>
                    )}
                </For>
            </ul>
            <div>{evaluatedTabs()[activeTab()].children}</div>
        </div>
    );
};

interface TabProps {
    title: string
    children: JSXElement
}
export const Tab: Component<TabProps> = (props) => {
    return props as unknown as JSXElement;
};