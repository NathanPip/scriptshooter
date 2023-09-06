import { Component, For, createEffect, createSignal, onCleanup } from "solid-js";
import { initializationRan, openProjectHandler, setInputModalType, setShowInputModal, setShowSettingsModal } from "../App";
import { allProjects } from "../state";
import { Project } from "../data";

const Main: Component = () => {

    const [focusedProject, setFocusedProject] = createSignal<
    Project | undefined
  >();

    function addProjectHandler() {
        setShowInputModal(true);
        setInputModalType("new project");
      }
    
      function addFolderHandler() {
        setShowInputModal(true);
        setInputModalType("new folder");
      }
    
      function shortcutEventHandler(e: KeyboardEvent) {
        if (e.key === "n" && e.ctrlKey) {
          openProjectHandler("nvim", allProjects()[0]);
          return;
        }
        if (e.key === "v" && e.ctrlKey) {
          openProjectHandler("vs", allProjects()[0]);
          return;
        }
        if (!focusedProject()) return;
        if (e.key === "n") {
          openProjectHandler("nvim", focusedProject() as Project);
          return;
        }
        if (e.key === "v") {
          openProjectHandler("vs", focusedProject() as Project);
        }
      }
    
      createEffect(() => {
        if (!initializationRan()) return;
        addEventListener("keydown", shortcutEventHandler);
    
        onCleanup(() => {
          removeEventListener("keydown", shortcutEventHandler);
        });
      });

  return (
    <>
      <div class="flex gap-4 justify-start px-2 my-4 text-lg w-full ">
        <button
          tabIndex={-1}
          onClick={() => openProjectHandler("nvim", allProjects()[0])}
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          Open Most Recent
        </button>
        <button
          tabIndex={-1}
          onClick={addProjectHandler}
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          New Project
        </button>
        <button
          tabIndex={-1}
          onClick={addFolderHandler}
          class="px-2 py-1 rounded-lg hover:bg-opacity-50 shadow-[0_1px_3px_1px_#737373] bg-neutral-900 shadow-secondary transition-colors"
        >
          Open Folder
        </button>
        <button
          tabIndex={-1}
          onClick={() => {
            setShowSettingsModal((prev) => !prev);
          }}
          class="ml-auto shadow-secondary transition-colors"
        >
          <img class="w-8 h-8" src="../../cog.svg" />
        </button>
      </div>
      <div class="w-full">
        <For each={allProjects()}>
          {(proj) => (
            <div
              onFocus={() => {
                setFocusedProject(proj);
              }}
              onBlur={() => {
                setFocusedProject(undefined);
              }}
              class="flex items-center text-left rounded-lg w-full px-2 pl-4 py-4 bg-opacity-0 m-2 shadow-[0_2px_3px_-1px_#737373] outline-none focus:translate-x-[4px] focus:border-l-[4px] focus:border-neutral-300 transition-all"
              tabIndex={0}
            >
              <div class="flex-1">
                <h2 class="text-3xl">{proj.name}</h2>
                <p class="mr-2 text-sm text-neutral-500">
                  last opened{" "}
                  {proj.lastOpened > 0
                    ? new Date(proj.lastOpened).toLocaleDateString()
                    : "never"}
                </p>
              </div>
              <div
                class={`mx-4 transition-opacity ${
                  proj === focusedProject()
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <button
                  tabIndex={-1}
                  class="py-1 px-1 text-sm rounded-md mx-1 shadow-[0_1px_3px_1px_#737373]"
                >
                  NV
                </button>
                <button
                  tabIndex={-1}
                  class="py-1 px-1 text-sm rounded-md mx-1 shadow-[0_1px_3px_1px_#737373]"
                >
                  VS
                </button>
              </div>
              <p class="mr-2 text-neutral-500 italic">{proj.path}</p>
              {/* <button
                tabIndex={-1}
                onClick={() => openProjectHandler("nvim", proj)}
                class="text-2xl mx-4 bg-neutral-900 px-2 py-1 rounded-md hover:bg-opacity-50 transition-colors shadow-[0_1px_3px_1px_#737373]"
              >
                Nvim
              </button>
              <button
                tabIndex={-1}
                onClick={() => openProjectHandler("vs", proj)}
                class="text-2xl mx-4 bg-neutral-900 px-2 py-1 rounded-md hover:bg-opacity-50 transition-colors shadow-[0_1px_3px_1px_#737373]"
              >
                VS
              </button> */}
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default Main;
