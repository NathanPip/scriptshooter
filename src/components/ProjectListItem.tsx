import { Component, Show, createSignal } from "solid-js";
import { Project, configStore, saveProjectsData } from "../data";
import { focusedProject, setFocusedProject } from "./Main";
import { openCMD, openProjectHandler } from "../App";
import Elipsis from "../icons/elipsis";
import { setAllProjects } from "../state";

export function deleteProjectHandler(proj: Project) {
    setAllProjects((prev) => prev.filter((p) => p.path !== proj.path));
    saveProjectsData();
}

const ProjectListItem: Component<{ proj: Project }> = (props) => {
    const [showMenu, setShowMenu] = createSignal(false);

    return (
        <div
            onFocus={() => {
                setFocusedProject(props.proj);
            }}
            onMouseOver={() => {
                setFocusedProject(props.proj);
            }}
            class={`flex items-center text-left rounded-lg 
                                        px-4 pl-4 py-4 bg-opacity-0 mx-2 my-4 transition-all ${focusedProject() == props.proj
                    ? "translate-x-[4px] border-emerald-950 shadow-[-4px_0px_20px_-7px_#022c22] border-2"
                    : "border-neutral-900 border-2"
                }`}
            tabIndex={0}
        >
            <div class="flex-1">
                <h2 class="text-2xl">{props.proj.name}</h2>
                <p class="mr-2 text-sm text-neutral-500">
                    last opened{" "}
                    {props.proj.lastOpened > 0
                        ? `${new Date(props.proj.lastOpened).toLocaleDateString()}`
                        : "never"}
                </p>
            </div>
            <div
                class={`mx-4 transition-opacity ${props.proj === focusedProject()
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                <Show when={configStore.nvim.length > 0}>
                    <button
                        onClick={() => {
                            openProjectHandler("nvim", props.proj);
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
                            openProjectHandler("vs", props.proj);
                        }}
                        tabIndex={-1}
                        class="py-1 px-1 text-sm rounded-md mx-2 shadow-[-5px_8px_20px_-7px_#022c22]"
                    >
                        VS
                    </button>
                </Show>
                <button
                    onClick={() => {
                        openCMD(props.proj.path as string);
                    }}
                    tabIndex={-1}
                    class="py-1 px-1 text-sm rounded-md mx-2 shadow-[-5px_8px_20px_-7px_#022c22]"
                >
                    CL
                </button>
            </div>
            <p class="mr-2 text-neutral-500 italic">{props.proj.path}</p>
            <button onClick={() => { setShowMenu((prev) => !prev) }} class={`absolute mt-1 top-0 right-0 
                        ${props.proj === focusedProject()
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
            >
                <Elipsis />
            </button>
            <Show when={showMenu()}>
                <div class="absolute z-10 w-24 -top-full right-0 mt-8 mr-2 bg-neutral-950 rounded-lg shadow-[-4px_0px_20px_-7px_#022c22]">
                    {/*<button class="px-2 py-1 w-full text-left hover:bg-neutral-900 rounded-t-lg">Rename</button>*/}
                    <button onClick={() => {deleteProjectHandler(props.proj)}} class="px-2 py-1 w-full text-left hover:bg-neutral-900">Delete</button>
                </div>
            </Show>
            <div>

            </div>
        </div>
    )
}

export default ProjectListItem;
