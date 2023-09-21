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
import ProjectList from "./ProjectList";

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
        <div class="h-screen overflow-hidden">
            <div class="flex gap-4 mx-3 my-2 text-lg w-full max-h-[20%]">
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
                    class={`absolute right-0 mr-2 shadow-secondary transition-colors transition-transform duration-200 hover:rotate-180`}
                >
                    <img class="w-8 h-8" src="../../cog.svg" />
                </button>
            </div>
            <div class="w-full mt-12 flex flex-col flex-1 max-h-[80%]">
                <h1 class="text-3xl ml-4">Projects</h1>
                <ProjectList />
            </div>
        </div>
    );
};

export default Main;
