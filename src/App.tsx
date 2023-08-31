import { Show, createEffect, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { initialStart } from "./startup";
import InputModal from "./components/InputModal";

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [savedProjects, setSavedProjects] = createSignal([]);
  const [name, setName] = createSignal("");
  const [initializationRan, setInitializationRan] = createSignal(false);
  const [showInputModal, setShowInputModal] = createSignal(false);
  const [inputModalType, setInputModalType] = createSignal("");

  onMount(async () => {
    await initialStart();
    setInitializationRan(true);
  })

  function addProjectHandler() {
    setShowInputModal(true);
    setInputModalType("new project");
  }

  async function addProject() {

  }

  async function getSavedProjects() {

  }

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <div class="w-full overflow-hidden">
    <Show when={showInputModal()}>
      <InputModal type={inputModalType()} />
    </Show>
      <div class="flex gap-2 justify-center py-4 text-2xl border-b-2 border-secondary w-full">
        <button class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">Open Most Recent</button>
        <button onClick={addProjectHandler} class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">New Project</button>
        <button class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">Open Folder</button>
        <button class="bg-primary bg-opacity-50 px-4 py-2 rounded-md">Config</button>
      </div>
    <div class="w-full">
        <button class="text-2xl text-left w-full px-2 pl-4 py-4 bg-primary bg-opacity-0 m-2 border-b-2 border-secondary">Ugras</button>
    </div>
    </div>
  );
}

export default App;
