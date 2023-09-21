import {
    Component,
    For,
    Show,
    createEffect,
    createSignal,
    onCleanup,
} from "solid-js";
import {
    initializationRan,
    openCMD,
    openProjectHandler,
    setInputModalType,
    setShowInputModal,
    setShowSettingsModal,
} from "../App";
import { allProjects } from "../state";
import { Project, configStore } from "../data";
import AddDropdown from "./AddDropdown";

export function addProjectHandler() {
    setShowInputModal(true);
    setInputModalType("new project");
}

export function addFolderHandler() {
    setShowInputModal(true);
    setInputModalType("new folder");
}

const Main: Component = () => {
    const [focusedProject, setFocusedProject] = createSignal<
        Project | undefined
    >();
    function shortcutEventHandler(e: KeyboardEvent) {
        if (e.key === "Escape") {
            setShowInputModal(false);
            setShowSettingsModal(false);
            setFocusedProject(undefined);
            return;
        }
        if (e.key === "n" && e.ctrlKey && configStore.nvim.length > 0) {
            openProjectHandler("nvim", allProjects()[0]);
            return;
        }
        if (e.key === "v" && e.ctrlKey && configStore.vscode.length > 0) {
            openProjectHandler("vs", allProjects()[0]);
            return;
        }
        if (e.key === "c" && e.ctrlKey) {
            openCMD(allProjects()[0].path as string);
        }
        if (!focusedProject()) return;
        if (e.key === "n" && configStore.nvim.length > 0) {
            openProjectHandler("nvim", focusedProject() as Project);
            return;
        }
        if (e.key === "v" && configStore.vscode.length > 0) {
            openProjectHandler("vs", focusedProject() as Project);
        }
        if (e.key === "c") {
            openCMD(focusedProject()?.path as string);
        }
        console.log("pressed");
    }

    createEffect(() => {
        if (!initializationRan()) return;
        addEventListener("keypress", shortcutEventHandler);

        onCleanup(() => {
            removeEventListener("keypress", shortcutEventHandler);
        });
    });

    return (
        <>
            <div class="flex gap-4 mx-3 my-2 text-lg w-full">
                <AddDropdown />
                {/* <button
                    tabIndex={-1}
                    onClick={() => openProjectHandler("nvim", allProjects()[0])}
                    class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
                >
                    Open Most Recent
                </button>
                */}
                <button
                    tabIndex={-1}
                    onClick={() => {
                        setShowSettingsModal((prev) => !prev);
                    }}
                    class="absolute right-0 mr-2 shadow-secondary transition-colors"
                >
                    <img class="w-8 h-8" src="../../cog.svg" />
                </button>
            </div>
            <div class="w-full mt-12">
            <h1 class="text-2xl ml-4">Projects</h1>
                <For each={allProjects()}>
                    {(proj) => (
                        <div
                            onFocus={() => {
                                setFocusedProject(proj);
                            }}
                            class={`flex border-neutral-900 border-2 items-center text-left rounded-lg w-full px-2 pl-4 py-4 bg-opacity-0 m-2 my-4 outline-none transition-transform ${focusedProject() == proj
                                    ? "translate-x-[4px] border-neutral-900 border-2"
                                    : "border-neutral-900 border-2"
                                }`}
                            tabIndex={0}
                        >
                            <div class="flex-1">
                                <h2 class="text-3xl">{proj.name}</h2>
                                <p class="mr-2 text-sm text-neutral-500">
                                    last opened{" "}
                                    {proj.lastOpened > 0
                                        ? `${new Date(proj.lastOpened).toLocaleDateString()}`
                                        : "never"}
                                </p>
                            </div>
                            <div
                                class={`mx-4 transition-opacity ${proj === focusedProject()
                                        ? "opacity-100 pointer-events-auto"
                                        : "opacity-0 pointer-events-none"
                                    }`}
                            >
                                <Show when={configStore.nvim.length > 0}>
                                    <button
                                        onClick={() => {
                                            openProjectHandler("nvim", proj);
                                        }}
                                        tabIndex={-1}
                                        class="py-1 px-1 text-sm rounded-md mx-1 shadow-[0_1px_3px_1px_#737373]"
                                    >
                                        NV
                                    </button>
                                </Show>
                                <Show when={configStore.vscode.length > 0}>
                                    <button
                                        onClick={() => {
                                            openProjectHandler("vs", proj);
                                        }}
                                        tabIndex={-1}
                                        class="py-1 px-1 text-sm rounded-md mx-1 shadow-[0_1px_3px_1px_#737373]"
                                    >
                                        VS
                                    </button>
                                </Show>
                                <button
                                    onClick={() => {
                                        openCMD(proj.path as string);
                                    }}
                                    tabIndex={-1}
                                    class="py-1 px-1 text-sm rounded-md mx-1 shadow-[0_1px_3px_1px_#737373]"
                                >
                                    CL
                                </button>
                            </div>
                            <p class="mr-2 text-neutral-500 italic">{proj.path}</p>
                        </div>
                    )}
                </For>
            </div>
        </>
    );
};

export default Main;
