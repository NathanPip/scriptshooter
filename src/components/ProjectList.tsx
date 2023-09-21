import { Component, For, Show, createSignal } from "solid-js";
import { allProjects } from "../state";
import { Project, configStore } from "../data";
import { openCMD, openProjectHandler } from "../App";

const ProjectList: Component = () => {
    const [focusedProject, setFocusedProject] = createSignal<
        Project | undefined
    >();

    return (
    <div class="overflow-y-scroll overflow-x-hidden flex-1">
        <For each={allProjects()}>
            {(proj) => (
                <div
                    onFocus={() => {
                        setFocusedProject(proj);
                    }}
                    onMouseOver={() => {
                        setFocusedProject(proj);
                    }}
                    class={`flex items-center text-left rounded-lg w-full
                                        px-2 pl-4 py-4 bg-opacity-0 m-2 my-4 transition-all ${focusedProject() == proj
                            ? "translate-x-[4px] border-emerald-950 shadow-[-4px_0px_20px_-7px_#022c22] border-2"
                            : "border-neutral-900 border-2"
                        }`}
                    tabIndex={0}
                >
                    <div class="flex-1">
                        <h2 class="text-2xl">{proj.name}</h2>
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
                                class="py-1 px-1 text-sm rounded-md mx-2 shadow-[-5px_8px_20px_-7px_#022c22]"
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
                                class="py-1 px-1 text-sm rounded-md mx-2 shadow-[-5px_8px_20px_-7px_#022c22]"
                            >
                                VS
                            </button>
                        </Show>
                        <button
                            onClick={() => {
                                openCMD(proj.path as string);
                            }}
                            tabIndex={-1}
                            class="py-1 px-1 text-sm rounded-md mx-2 shadow-[-5px_8px_20px_-7px_#022c22]"
                        >
                            CL
                        </button>
                    </div>
                    <p class="mr-2 text-neutral-500 italic">{proj.path}</p>
                </div>
            )}
        </For>
    </div>);
};

export default ProjectList;
