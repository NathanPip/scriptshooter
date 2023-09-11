import { Component, createEffect, createSignal } from "solid-js";
import { openNvimHandler, setShowSettingsModal } from "../App";
import { configStore, setConfigStore } from "../data";
import { PathInput } from "./InitializationScreen";

const SettingsModal: Component = () => {
  const [nvimConfigPath, setNvimConfigPath] = createSignal(configStore.config);
  const [nvimPath, setNvimPath] = createSignal(configStore.nvim);
  const [vsCodePath, setVsCodePath] = createSignal(configStore.vscode);

  const [canSetNvimPath, setCanSetNvimPath] = createSignal(false);
  const [canSetNvimConfigPath, setCanSetNvimConfigPath] = createSignal(false);
  const [canSetVsCodePath, setCanSetVsCodePath] = createSignal(false);

  const [hasSetNvimPath, setHasSetNvimPath] = createSignal(false);
  const [hasSetNvimConfigPath, setHasSetNvimConfigPath] = createSignal(false);
  const [hasSetVsCodePath, setHasSetVsCodePath] = createSignal(false);

  createEffect(() => {
    if (
      nvimPath().length > 0 &&
      nvimPath() !== removeDoubleSlashes(configStore.nvim)
    ) {
      setCanSetNvimPath(true);
    } else {
      setCanSetNvimPath(false);
    }
  });

  createEffect(() => {
    if (
      nvimConfigPath().length > 0 &&
      nvimConfigPath() !== removeDoubleSlashes(configStore.config)
    ) {
      setCanSetNvimConfigPath(true);
    } else {
      setCanSetNvimConfigPath(false);
    }
  });

  createEffect(() => {
    if (
      vsCodePath().length > 0 &&
      vsCodePath() !== removeDoubleSlashes(configStore.vscode)
    ) {
      setCanSetVsCodePath(true);
    } else {
      setCanSetVsCodePath(false);
    }
  });

  const removeDoubleSlashes = (path: string) => {
    return path.replace(/\\\\/g, "\\");
  };

  return (
    <div class="w-full h-screen bg-neutral-950 flex justify-center absolute">
      <button
        onClick={() => setShowSettingsModal(false)}
        class="absolute right-0 top-0 m-6 text-lg"
      >
        X
      </button>
      <div class="flex flex-col mt-24 w-1/2">
        <h1 class="text-4xl mb-6 text-center">Settings</h1>
        <div class="flex">
          <div class="flex-1">
            <PathInput
              setter={setNvimConfigPath}
              placeholder={"set Path to Neovim config directory"}
              directory={true}
              defaultValue={removeDoubleSlashes(configStore.config)}
            ></PathInput>
          </div>
          <button
            class={`w-fit mx-2 rounded-sm py-1 px-2 h-fit my-auto text-lg bg-neutral-800 text-neutral-300 ${
              canSetNvimConfigPath()
                ? "bg-neutral-800 text-neutral-300"
                : "bg-neutral-900 text-neutral-700 pointer-events-none"
            }`}
            disabled={!canSetNvimConfigPath()}
            onClick={() => {
              setConfigStore("config", nvimConfigPath());
              setHasSetNvimConfigPath(true);
            }}
          >
            Set
          </button>
          <img
            class={`w-6 h-6 my-auto ${
              hasSetNvimConfigPath() ? "opacity-100" : "opacity-0"
            }`}
            src="../../check.svg"
          />
        </div>
        <div class="flex">
          <div class="flex-1">
            <PathInput
              setter={setNvimPath}
              placeholder={"set Path to Neovim.exe"}
              endsWith={"nvim.exe"}
              defaultValue={removeDoubleSlashes(configStore.nvim)}
            ></PathInput>
          </div>
          <button
            class={`w-fit mx-2 rounded-sm py-1 px-2 h-fit my-auto text-lg bg-neutral-800 text-neutral-300 ${
              canSetNvimPath()
                ? "bg-neutral-800 text-neutral-300"
                : "bg-neutral-900 text-neutral-700 pointer-events-none"
            }`}
            disabled={!canSetNvimPath()}
            onClick={() => {
              setConfigStore("nvim", nvimPath());
              setHasSetNvimPath(true);
            }}
          >
            Set
          </button>
          <img
            class={`w-6 h-6 my-auto ${
              hasSetNvimPath() ? "opacity-100" : "opacity-0"
            }`}
            src="../../check.svg"
          />
        </div>
        <div class="flex">
          <div class="flex-1">
            <PathInput
              setter={setVsCodePath}
              placeholder={"set Path to Code.exe"}
              endsWith={"Code.exe"}
              defaultValue={removeDoubleSlashes(configStore.vscode)}
            ></PathInput>
          </div>
          <button
            class={`w-fit mx-2 rounded-sm py-1 px-2 h-fit my-auto text-lg bg-neutral-800 text-neutral-300 ${
              canSetVsCodePath()
                ? "bg-neutral-800 text-neutral-300"
                : "bg-neutral-900 text-neutral-700 pointer-events-none"
            }`}
            disabled={!canSetVsCodePath()}
            onClick={() => {
              setConfigStore("vscode", vsCodePath());
              setHasSetVsCodePath(true);
            }}
          >
            Set
          </button>
          <img
            class={`w-6 h-6 my-auto ${
              hasSetVsCodePath() ? "opacity-100" : "opacity-0"
            }`}
            src="../../check.svg"
          />
        </div>
        <button
          class={`py-2 px-3 w-1/2 mx-auto rounded-md text-lg mt-4 ${
            configStore.config
              ? "bg-neutral-800 text-neutral-300"
              : "bg-neutral-900 text-neutral-700 pointer-events-none"
          }`}
          onClick={() => {
            openNvimHandler(configStore.config);
          }}
        >
          Edit NVIM config
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
