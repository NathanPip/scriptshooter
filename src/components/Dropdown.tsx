import { Component, For, Show, createSignal } from "solid-js"

const Dropdown: Component<{ title: string, buttons: { title: string, clickEvent: () => void, customStyles?: string }[] }> = (props) => {
    const [dropdownHidden, setDropdownHidden] = createSignal(true);
    return (
        <div class="flex flex-col justify-center items-center">
            <button
                class="px-4 py-1 flex items-center border-emerald-950 border-[1px] w-40 rounded-md shadow-[-5px_15px_15px_-15px_#022c22] shadow-secondary transition-colors"
                onClick={() => { setDropdownHidden((prev) => !prev) }}
            >
                {props.title}
                <img class={`w-6 h-6 ml-auto transition-transform duration-300 ${!dropdownHidden() ? "rotate-180" : ""}`} src="../dropdown.svg" />
            </button>
            <div class="relative self-start overflow-visible ">
                <Show when={!dropdownHidden()}>
                    <div class="absolute w-40 left-0 top-0 flex flex-col text-start rounded-b-md shadow-[-5px_15px_15px_-15px_#022c22] z-20">
                        <For each={props.buttons}>
                            {(button) => (
                                <button
                                    onClick={button.clickEvent}
                                    class={button.customStyles ? button.customStyles : "px-2 py-2 text-base text-start bg-neutral-950 shadow-secondary transition-colors"}
                                >
                                    {button.title}
                                </button>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );
};

export default Dropdown;
