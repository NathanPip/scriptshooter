import { open } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { Component, Setter, createEffect, createSignal } from "solid-js";
import { saveConfigData, setConfigStore } from "../data";
import { setHasInitialized } from "../App";

export const PathInput: Component<{
  setter: Setter<string>;
  defaultValue?: string;
  placeholder?: string;
  directory?: boolean;
  endsWith?: string;
}> = (props) => {
  const [error, setError] = createSignal(false);
  const [validPath, setValidPath] = createSignal("");

  let inputElement: HTMLInputElement | undefined = undefined;

  async function chooseDirectoryFromExplorer() {
    const path = await open({
      multiple: false,
      directory: true,
    });
    if (path === null) return undefined;
    if (path.length <= 0) return undefined;
    return path as string;
  }

  async function chooseFileFromExplorer() {
    const path = await open({
      multiple: false,
      directory: false,
    });
    if (path === null) return;
    if (path.length <= 0) return;
    return path as string;
  }

  const validateEntry = async (path: string) => {
    const result = await exists(path);
    if (!result) {
      return false;
    }
    if (props.endsWith) {
      return path.endsWith(props.endsWith);
    }
    return true;
  };

  createEffect(() => {
    if (validPath()) {
      props.setter(validPath());
    } else {
      props.setter("");
    }
  });

  const pathChangeHandler = async (path: string) => {
    const valid = await validateEntry(path);
    if (!valid) {
      setError(true);
      setValidPath("");
      return;
    } else {
      setError(false);
      setValidPath(path);
      return;
    }
  };

  const chooseFromExplorerHandler = async () => {
    let path: string | undefined;
    if (props.directory) {
      path = await chooseDirectoryFromExplorer();
    } else {
      path = await chooseFileFromExplorer();
    }
    if (path) {
      if (!inputElement) return;
      inputElement.value = path;
      await pathChangeHandler(path);
    }
  };

  return (
    <div class="my-2 flex items-center">
      <button onClick={chooseFromExplorerHandler}>
        <img class="w-6 h-6" src="../../folder.svg" />
      </button>
      <input
        class={`ml-2 py-2 px-3 flex-1 tracking-wider bg-neutral-900 
          ${error() ? "border-2 border-red-500" : ""} 
          ${validPath() ? "border-2 border-green-300" : ""}
        }`}
        ref={inputElement}
        placeholder={props.placeholder ?? "Enter Path"}
        onChange={() => pathChangeHandler(inputElement?.value ?? "")}
        value={props.defaultValue ?? ""}
      ></input>
    </div>
  );
};

const InitializationScreen: Component = () => {
  let configEl: HTMLInputElement | undefined;
  let nvimEl: HTMLInputElement | undefined;
  let vsCodeEl: HTMLInputElement | undefined;

  const [configError, setConfigError] = createSignal(false);
  const [nvimError, setNvimError] = createSignal(false);
  const [vsCodeError, setVsCodeError] = createSignal(false);

  const [configPathSet, setConfigPathSet] = createSignal(false);
  const [nvimPathSet, setNvimPathSet] = createSignal(false);
  const [vsCodePathSet, setVsCodePathSet] = createSignal(false);

  const [canContinue, setCanContinue] = createSignal(false);

  async function chooseDirectoryFromExplorer() {
    const path = await open({
      multiple: false,
      directory: true,
    });
    if (path === null) return undefined;
    if (path.length <= 0) return undefined;
    return path as string;
  }

  async function chooseFileFromExplorer() {
    const path = await open({
      multiple: false,
      directory: false,
    });
    if (path === null) return;
    if (path.length <= 0) return;
    return path as string;
  }

  async function checkExists(path: string) {
    const result = await exists(path);
    return result;
  }

  async function validateVSCodeExe(path: string) {
    const doesExist = await checkExists(path);
    if (!doesExist) return false;
    return path.endsWith("Code.exe");
  }

  async function validateNeovimExe(path: string) {
    const doesExist = await checkExists(path);
    if (!doesExist) return false;
    return path.endsWith("nvim.exe");
  }

  // function addSlashes(path: string) {
  //   return path.replace(/\\/g, "\\\\");
  // }

  async function continueButtonHandler() {
    if (!nvimPathSet() && !vsCodePathSet()) return;
    const configPath = configEl?.value ? configEl?.value : "";
    const nvimPath = nvimEl?.value ? nvimEl?.value : "";
    const vsCodePath = vsCodeEl?.value ? vsCodeEl?.value : "";
    setConfigStore({
      config: configPath,
      nvim: nvimPath,
      vscode: vsCodePath,
    });
    await saveConfigData();
    setHasInitialized(true);
  }

  createEffect(async () => {
    if (nvimPathSet() || vsCodePathSet()) {
      setCanContinue(true);
    } else if (!nvimPathSet() && !vsCodePathSet()) {
      setCanContinue(false);
    }
  });

  return (
    <div class="w-full h-screen bg-neutral-950 flex flex-col justify-center items-center absolute">
      <div class="my-2 flex items-center w-1/2">
        <button
          class="px-2"
          onClick={async () => {
            const path = await chooseDirectoryFromExplorer();
            if (path === undefined) return;
            const validPath = await checkExists(path);
            if (!validPath) {
              setConfigError(true);
              setConfigPathSet(false);
              return;
            }
            setConfigError(false);
            if (!configEl) return;
            configEl.value = path;
            setConfigPathSet(true);
          }}
        >
          <img class="w-6 h-6" src="../../folder.svg" />
        </button>
        <input
          class={`py-2 px-3 flex-1 bg-neutral-900 
          ${configError() ? "border-2 border-red-500" : ""} 
          ${configPathSet() ? "border-2 border-green-300" : ""}`}
          ref={configEl}
          placeholder="Add Path to Neovim Config Folder"
          onChange={async (e) => {
            const path = e.currentTarget.value;
            const validPath = await checkExists(path);
            if (!validPath) {
              setConfigError(true);
              setConfigPathSet(false);
              return;
            }
            setConfigError(false);
            setConfigPathSet(true);
          }}
        ></input>
      </div>

      <div class="my-2 flex items-center w-1/2">
        <button
          class="px-2"
          onClick={async () => {
            const path = await chooseFileFromExplorer();
            if (path === undefined) return;
            const validPath = await validateNeovimExe(path);
            if (!validPath) {
              setNvimError(true);
              setNvimPathSet(false);
              return;
            }
            if (!nvimEl) return;
            nvimEl.value = path;
            setNvimError(false);
            setNvimPathSet(true);
          }}
        >
          <img class="w-6 h-6" src="../../folder.svg" />
        </button>
        <input
          class={`py-2 px-3 flex-1 bg-neutral-900 
          ${nvimError() ? "border-2 border-red-500" : ""} 
          ${nvimPathSet() ? "border-2 border-green-300" : ""}
        }`}
          ref={nvimEl}
          placeholder="Add Path to Neovim Executable"
          onChange={async (e) => {
            const path = e.currentTarget.value;
            const validPath = await validateNeovimExe(path);
            if (!validPath) {
              setNvimError(true);
              setNvimPathSet(false);
              return;
            }
            setNvimError(false);
            setNvimPathSet(true);
          }}
        ></input>
      </div>

      <div class="my-2 flex items-center w-1/2">
        <button
          class="px-2"
          onClick={async () => {
            const path = await chooseFileFromExplorer();
            if (path === undefined) return;
            const validPath = await validateVSCodeExe(path);
            if (!validPath) {
              setVsCodeError(true);
              setVsCodePathSet(false);
            }
            if (!vsCodeEl) return;
            vsCodeEl.value = path;
            setVsCodeError(false);
            setVsCodePathSet(true);
          }}
        >
          <img class="w-6 h-6" src="../../folder.svg" />
        </button>
        <input
          class={`py-2 px-3 flex-1 bg-neutral-900 
          ${vsCodeError() ? "border-2 border-red-500" : ""} 
          ${vsCodePathSet() ? "border-2 border-green-300" : ""}`}
          ref={vsCodeEl}
          placeholder="Add Path to VSCode Executable"
          onChange={async (e) => {
            const path = e.currentTarget.value;
            const validPath = await validateVSCodeExe(path);
            if (!validPath) {
              setVsCodeError(true);
              setVsCodePathSet(false);
              return;
            }
            setVsCodeError(false);
            setVsCodePathSet(true);
          }}
        ></input>
      </div>
      <button
        onClick={() => {
          if (!canContinue()) return;
          continueButtonHandler();
        }}
        class={`py-2 px-3 rounded-md text-xl mt-4 ${
          canContinue()
            ? "bg-neutral-800 text-neutral-300"
            : "bg-neutral-900 text-neutral-700 pointer-events-none"
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default InitializationScreen;
