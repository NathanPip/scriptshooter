import { open } from "@tauri-apps/api/dialog";
import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import { addFolderData, addProjectData } from "../data";
import { setShowInputModal } from "../App";

const InputModal: Component<{ type: string }> = (props) => {
  const [inputPlaceholder, setInputPlaceholder] = createSignal("");
  let fileInput: HTMLInputElement | undefined;

  function addProjectHandler() {
    addProjectData(fileInput?.value as string);
    setShowInputModal(false);
  }

  function addFolderHandler() {
    addFolderData(fileInput?.value as string);
    setShowInputModal(false);
  }

  function escapeHandler(e: KeyboardEvent) {
    if(e.key === "Escape") {
      setShowInputModal(false)
    }
  }

  async function chooseFromFileExplorer() {
    if (!fileInput) return;
    const result = await open({
      multiple: false,
      directory: true,
    });
    if (result === null) return;
    if (result.length <= 0) return;
    fileInput.value = result as string;
    switch (props.type) {
      case "new project":
        addProjectHandler();
        break;
      case "new folder":
        addFolderHandler();
        break;
    }
  }

  createEffect(() => {
    if (props.type === "new project") {
      setInputPlaceholder("Path to Project");
    } else if(props.type === "new folder") {
      setInputPlaceholder("Path to Folder");
    }
  });

  createEffect(() => {
    addEventListener("keydown", escapeHandler)
    onCleanup(() => {
      removeEventListener("keydown", escapeHandler);
    })
  })

  return (
    <div class="w-full h-screen bg-opacity-80 bg-neutral-900 flex justify-center items-center absolute">
      <div class="w-1/2 flex relative">
        <button onClick={() => setShowInputModal(false)} class="absolute right-0 top-0 -m-10 px-2 py-1 rounded-md text-xl hover:bg-opacity-50">
          X
        </button>
        <button class="px-2" onClick={chooseFromFileExplorer}>
          <img class="w-6 h-6" src="../../folder.svg" />
        </button>
        <input
          ref={fileInput}
          class="py-2 px-3 flex-1"
          placeholder={inputPlaceholder()}
        />
        <button onClick={addProjectHandler} class="ml-2 px-2">
          Open
        </button>
      </div>
    </div>
  );
};

export default InputModal;
