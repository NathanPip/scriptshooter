import { open } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { Component, createEffect, createSignal } from "solid-js";
import { saveConfigData, setConfigStore } from "../data";
import { setHasInitialized } from "../App";

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

  createEffect(async () => {
    if (configPathSet() && nvimPathSet() && vsCodePathSet()) {
        setConfigStore({
            config: configEl?.value as string,
            nvim: nvimEl?.value as string,
            vscode: vsCodeEl?.value as string,
        })
        await saveConfigData();
        setHasInitialized(true);
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
    </div>
  );
};

export default InitializationScreen;
