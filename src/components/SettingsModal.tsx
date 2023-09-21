import { Component, createEffect, createSignal } from "solid-js";
import { openNvimHandler, setShowSettingsModal } from "../App";
import { configStore, saveConfigData, setConfigStore } from "../data";
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
            nvimPath() !== configStore.nvim
        ) {
            setCanSetNvimPath(true);
        } else {
            setCanSetNvimPath(false);
        }
    });

    createEffect(() => {
        if (
            nvimConfigPath().length > 0 &&
            nvimConfigPath() !== configStore.config
        ) {
            setCanSetNvimConfigPath(true);
        } else {
            setCanSetNvimConfigPath(false);
        }
    });

    createEffect(() => {
        if (
            vsCodePath().length > 0 &&
            vsCodePath() !== configStore.vscode
        ) {
            setCanSetVsCodePath(true);
        } else {
            setCanSetVsCodePath(false);
        }
    });

    return (
        <div class="w-full translate-x-0 min-h-screen bg-neutral-950 flex flex-col items-center absolute top-0 left-0 z-60">
            <button
                onClick={() => setShowSettingsModal(false)}
                class="absolute right-0 top-0 m-4 text-xl w-6 h-6"
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
                            defaultValue={configStore.config}
                        ></PathInput>
                    </div>
                    <button
                        class={`w-fit mx-2 rounded-sm py-1 px-2 h-fit my-auto text-lg bg-neutral-800 text-neutral-300 ${canSetNvimConfigPath()
                                ? "bg-neutral-800 text-neutral-300"
                                : "bg-neutral-900 text-neutral-700 pointer-events-none"
                            }`}
                        disabled={!canSetNvimConfigPath()}
                        onClick={() => {
                            setConfigStore("config", nvimConfigPath());
                            saveConfigData();
                            setHasSetNvimConfigPath(true);
                        }}
                    >
                        Set
                    </button>
                    <img
                        class={`w-6 h-6 my-auto ${hasSetNvimConfigPath() ? "opacity-100" : "opacity-0"
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
                            defaultValue={configStore.nvim}
                        ></PathInput>
                    </div>
                    <button
                        class={`w-fit mx-2 rounded-sm py-1 px-2 h-fit my-auto text-lg bg-neutral-800 text-neutral-300 ${canSetNvimPath()
                                ? "bg-neutral-800 text-neutral-300"
                                : "bg-neutral-900 text-neutral-700 pointer-events-none"
                            }`}
                        disabled={!canSetNvimPath()}
                        onClick={() => {
                            setConfigStore("nvim", nvimPath());
                            saveConfigData();
                            setHasSetNvimPath(true);
                        }}
                    >
                        Set
                    </button>
                    <img
                        class={`w-6 h-6 my-auto ${hasSetNvimPath() ? "opacity-100" : "opacity-0"
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
                            defaultValue={configStore.vscode}
                        ></PathInput>
                    </div>
                    <button
                        class={`w-fit mx-2 rounded-sm py-1 px-2 h-fit my-auto text-lg bg-neutral-800 text-neutral-300 ${canSetVsCodePath()
                                ? "bg-neutral-800 text-neutral-300"
                                : "bg-neutral-900 text-neutral-700 pointer-events-none"
                            }`}
                        disabled={!canSetVsCodePath()}
                        onClick={() => {
                            setConfigStore("vscode", vsCodePath());
                            saveConfigData();
                            setHasSetVsCodePath(true);
                        }}
                    >
                        Set
                    </button>
                    <img
                        class={`w-6 h-6 my-auto ${hasSetVsCodePath() ? "opacity-100" : "opacity-0"
                            }`}
                        src="../../check.svg"
                    />
                </div>
                <button
                    class={`py-2 px-3 w-1/2 mx-auto rounded-md text-lg mt-4 ${configStore.config
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
            <div class="w-3/4 flex flex-col items-center text-neutral-600 my-8">
                <div class="flex">
                    <h3 class="text-center text-2xl mb-2 font-semibold">Controls</h3>
                    <button>Edit</button>
                </div>
                <ul class="">
                    <li class="mt-2">
                        <span class="font-semibold">n: </span>Open's the currently selected project using Neovim
                    </li>
                    <li class="mt-2">
                        <span class="font-semibold">v: </span>Open's the currently selected project using VSCode
                    </li>
                    <li class="mt-2">
                        <span class="font-semibold">c: </span>Open's a command line window at the currently selected project
                    </li>
                    <li class="mt-2">
                        <span class="font-semibold">CTRL + n: </span>Open's the most recently opened project
                        using Neovim
                    </li>
                    <li class="mt-2">
                        <span class="font-semibold">CTRL + v: </span>Open's the most recently opened project
                        using VSCode
                    </li>
                    <li class="mt-2">
                        <span class="font-semibold">CTRL + c: </span>Open's a command line window at the most recently opened project
                    </li>
                    <li class="mt-2">
                        <span class="font-semibold">ESCAPE: </span>Closes any menus and/or deselects
                        currently selected project
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SettingsModal;
