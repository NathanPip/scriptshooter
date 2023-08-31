import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { Component, createEffect, createSignal } from "solid-js";
import { addProjectData } from "../data";
import { setShowInputModal } from "../App";

const InputModal: Component<{ type: string }> = (props) => {
  const [inputPlaceholder, setInputPlaceholder] = createSignal("");

  let fileInput: HTMLInputElement | undefined;

  createEffect(() => {
    if (props.type === "new project") {
      setInputPlaceholder("Path to Project");
    }
  });

  function addProjectHandler() {
    addProjectData(fileInput?.value as string);
    setShowInputModal(false);
  }

  async function chooseFromFileExplorer() {
    if(!fileInput) return;
    const result = await open({
        multiple: false,
        directory: true
    })
    if(result === null) return;
    if(!result.length) return;
    fileInput.value = result as string;
    addProjectHandler();
  }

  return (
    <div class="w-full h-screen bg-opacity-80 bg-background flex justify-center items-center absolute">
      <div class="w-1/2 flex">
        <button class="px-2" onClick={chooseFromFileExplorer}>Open</button>
        <input ref={fileInput} class="py-2 px-3 flex-1" placeholder={inputPlaceholder()} />
        <button onClick={addProjectHandler} class="ml-2 px-2">Check</button>
      </div>
    </div>
  );
};

export default InputModal;
