import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { initialStart } from "./startup";
import InputModal from "./components/InputModal";
import { allProjects, setAllProjects } from "./state";
import { Project } from "./data";

export const [showInputModal, setShowInputModal] = createSignal(false);
export const [inputModalType, setInputModalType] = createSignal("");

function App() {
  const [initializationRan, setInitializationRan] = createSignal(false);

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

  function openMostRecent() {
    openProjectHandler("nvim", allProjects()[0]);
  }

  function openProjectHandler(ide: "vs" | "nvim", proj: Project) {
    switch(ide) {
      case "vs":
        openVSHandler(proj.path);
        break;
      case "nvim":
        openNvimHandler(proj.path);
        break;
    }
    proj.lastOpened = Date.now();
    setAllProjects((prev) => [proj, ...prev.filter((p) => p.path !== proj.path)])
  }

  async function openNvimHandler(path: string) {
    await invoke("open_nvim", { path: path });
  }

  async function openVSHandler(path: string) {
    await invoke("open_vs", { path: path });
  }

  return (
    <div class="w-full overflow-hidden">
      <Show when={showInputModal()}>
        <InputModal type={inputModalType()} />
      </Show>
      <div class="flex gap-2 justify-center py-4 text-2xl border-b-2 border-secondary w-full">
        <button 
          onClick={openMostRecent}
          class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">
          Open Most Recent
        </button>
        <button
          onClick={addProjectHandler}
          class="bg-primary bg-opacity-50 px-4 py-2 rounded-md"
        >
          New Project
        </button>
        <button 
          onClick={addFolderHandler}
          class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">
          Open Folder
        </button>
        <button 
          onClick={() => openNvimHandler("C:\\Users\\Nather\\AppData\\Local\\nvim")}
          class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">
          Config
        </button>
      </div>
      <div class="w-full">
        <For each={allProjects()}>
          {(proj) => (
            <div class="flex text-left w-full px-2 pl-4 py-4 bg-opacity-0 m-2 border-b-2 border-secondary">
            <h2 class="text-3xl flex-1">{proj.name}</h2>
            <button
              onClick={() => openProjectHandler("nvim", proj)}
              class="text-2xl mx-4 bg-primary px-2 py-1 rounded-md hover:bg-opacity-50 transition-colors"
            >
              Nvim
            </button>
            <button
              onClick={() => openProjectHandler("vs", proj)}
              class="text-2xl mx-4 bg-primary px-2 py-1 rounded-md hover:bg-opacity-50 transition-colors"
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
