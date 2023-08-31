import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { Component, createEffect, createSignal } from "solid-js";

const InputModal: Component<{ type: string }> = (props) => {
  const [inputPlaceholder, setInputPlaceholder] = createSignal("");

  let fileInput: HTMLInputElement | undefined;

  createEffect(() => {
    if (props.type === "new project") {
      setInputPlaceholder("File Path to Project");
    }
  });

  async function chooseFromFileExplorer() {
    if(!fileInput) return;
    const result = await open({
        multiple: false,
        directory: true
    })
    fileInput.value = result as string;
  }

  return (
    <div class="w-full h-screen bg-opacity-80 bg-background flex justify-center items-center absolute">
      <input ref={fileInput} class="py-2 px-3 w-1/2" placeholder={inputPlaceholder()} />
      <button onClick={chooseFromFileExplorer}>Open</button>
    </div>
  );
};

export default InputModal;
