import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { initialStart } from "./startup";
import InputModal from "./components/InputModal";
import { allProjects, setAllProjects } from "./state";
import { Project, saveProjectsData } from "./data";

export const [showInputModal, setShowInputModal] = createSignal(false);
export const [inputModalType, setInputModalType] = createSignal("");

function App() {
  const [initializationRan, setInitializationRan] = createSignal(false);
  const [focusedProject, setFocusedProject] = createSignal<
    Project | undefined
  >();

  onMount(async () => {
    await initialStart();
    setInitializationRan(true);
  });

  function addProjectHandler() {
    setShowInputModal(true);
    setInputModalType("new project");
  }

  function addFolderHandler() {
    setShowInputModal(true);
    setInputModalType("new folder");
  }

  function openProjectHandler(ide: "vs" | "nvim", proj: Project) {
    switch (ide) {
      case "vs":
        openVSHandler(proj.path);
        break;
      case "nvim":
        openNvimHandler(proj.path);
        break;
    }
    proj.lastOpened = Date.now();
    setAllProjects((prev) => [
      proj,
      ...prev.filter((p) => p.path !== proj.path),
    ]);
    saveProjectsData();
  }

  async function openNvimHandler(path: string) {
    await invoke("open_nvim", { path: path });
  }

  async function openVSHandler(path: string) {
    await invoke("open_vs", { path: path });
  }

  function shortcutEventHandler(e: KeyboardEvent) {
    if (e.key === "n" && e.ctrlKey) {
      openProjectHandler("nvim", allProjects()[0]);
      return;
    }
    if (e.key === "v" && e.ctrlKey) {
      openProjectHandler("vs", allProjects()[0]);
      return;
    }
    if (!focusedProject()) return;
    if (e.key === "n") {
      openProjectHandler("nvim", focusedProject() as Project);
      return;
    }
    if (e.key === "v") {
      openProjectHandler("vs", focusedProject() as Project);
    }
  }

  createEffect(() => {
    if (!initializationRan()) return;
    addEventListener("keydown", shortcutEventHandler);

    onCleanup(() => {
      removeEventListener("keydown", shortcutEventHandler);
    });
  });

  return (
    <div class="w-full min-h-screen overflow-hidden">
      <Show when={showInputModal() === true}>
        <InputModal type={inputModalType()} />
      </Show>
      <div class="flex gap-4 justify-start px-2 my-4 text-lg w-full ">
        <button
          tabIndex={-1}
          onClick={() => openProjectHandler("nvim", allProjects()[0])}
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          Open Most Recent
        </button>
        <button
          tabIndex={-1}
          onClick={addProjectHandler}
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          New Project
        </button>
        <button
          tabIndex={-1}
          onClick={addFolderHandler}
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          Open Folder
        </button>
        <button
          tabIndex={-1}
          onClick={() =>
            openNvimHandler("C:\\Users\\Nather\\AppData\\Local\\nvim")
          }
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          Config
        </button>
      </div>
      <div class="w-full">
        <For each={allProjects()}>
          {(proj) => (
            <div
              onFocus={() => {
                setFocusedProject(proj);
              }}
              onBlur={() => {
                setFocusedProject(undefined);
              }}
              class="flex text-left w-full px-2 pl-4 py-4 bg-opacity-0 m-2 shadow-[0_2px_3px_-1px_#737373] outline-none focus:translate-x-[4px] focus:border-l-[4px] focus:border-neutral-300 transition-all"
              tabIndex={0}
            >
              <h2 class="text-3xl flex-1">{proj.name}</h2>
              <button
                tabIndex={-1}
                onClick={() => openProjectHandler("nvim", proj)}
                class="text-2xl mx-4 bg-neutral-900 px-2 py-1 rounded-md hover:bg-opacity-50 transition-colors shadow-[0_1px_3px_1px_#737373]"
              >
                Nvim
              </button>
              <button
                tabIndex={-1}
                onClick={() => openProjectHandler("vs", proj)}
                class="text-2xl mx-4 bg-neutral-900 px-2 py-1 rounded-md hover:bg-opacity-50 transition-colors shadow-[0_1px_3px_1px_#737373]"
              >
                VS
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default App;
