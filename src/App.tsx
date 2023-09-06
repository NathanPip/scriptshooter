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
import InputModal from "./components/InputModal";
import { allProjects, setAllProjects } from "./state";
import { configStore, initialStart, Project, saveProjectsData } from "./data";
import SettingsModal from "./components/SettingsModal";
import InitializationScreen from "./components/InitializationScreen";
import Main from "./components/Main";

export const [showInputModal, setShowInputModal] = createSignal(false);
export const [showSettingsModal, setShowSettingsModal] = createSignal(false);
export const [inputModalType, setInputModalType] = createSignal("");
export const [hasInitialized, setHasInitialized] = createSignal(false);

export function openProjectHandler(ide: "vs" | "nvim", proj: Project) {
  switch (ide) {
    case "vs":
      openVSHandler(proj.path);
      break;
    case "nvim":
      openNvimHandler(proj.path);
      break;
  }
  proj.lastOpened = Date.now();
  setAllProjects((prev) => [proj, ...prev.filter((p) => p.path !== proj.path)]);
  saveProjectsData();
}

export async function openNvimHandler(path: string) {
  await invoke("open_nvim", {nvim: configStore.nvim, path: path });
}

export async function openVSHandler(path: string) {
  await invoke("open_vs", { vs: configStore.vscode, path: path });
}

export const [initializationRan, setInitializationRan] = createSignal(false);

function App() {
  onMount(async () => {
    await initialStart();
    setInitializationRan(true);
  });

  return (
    <div class="w-full min-h-screen overflow-hidden">
      <Show when={showInputModal()}>
        <InputModal type={inputModalType()} />
      </Show>
      <Show when={showSettingsModal()}>
        <SettingsModal />
      </Show>
      <Show when={!hasInitialized()}>
        <InitializationScreen />
      </Show>
      <Show when={hasInitialized()}>
        <Main />
      </Show>
    </div>
  );
}

export default App;
