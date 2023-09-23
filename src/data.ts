import {
    BaseDirectory,
    createDir,
    exists,
    readDir,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/api/fs";
import { allProjects, setAllProjects } from "./state";
import { appDataDir } from "@tauri-apps/api/path";
import { setHasInitialized } from "./App";
import { createStore } from "solid-js/store";

export type Project = {
    name: string;
    path: string;
    lastOpened: number;
};

export type TKeymap = {
    first: { single: string, multi?: string },
    second?: { single: string, multi?: string },
}

type TConfigStore = {
    config: string;
    nvim: string;
    vscode: string;
    most_recent: "nvim" | "vs" | "";
    keymaps: { [key: string]: TKeymap };
}

export const [configStore, setConfigStore] = createStore<TConfigStore>({
    config: "",
    nvim: "",
    vscode: "",
    most_recent: "",
    keymaps: {
        open_recent_nvim: { first: { single: "Ctrl", multi: "n" } },
        open_recent_vs: { first: { single: "Ctrl", multi: "v" } },
        open_recent_cl: { first: { single: "Ctrl", multi: "c" } },
        open_nvim: { first: { single: "n", multi: undefined } },
        open_vs: { first: { single: "v", multi: undefined } },
        open_cl: { first: { single: "c", multi: undefined } },
        close: { first: { single: "Escape", multi: undefined } },
    }
});

export async function saveProjectsData() {
    await writeTextFile(`projects.json`, JSON.stringify(allProjects()), {
        dir: BaseDirectory.AppData,
    });
}

export async function saveConfigData() {
    await writeTextFile(`config.json`, JSON.stringify(configStore), {
        dir: BaseDirectory.AppData,
    });
}

export async function getProjectsData() {
    const projectsString = await readTextFile(`projects.json`, {
        dir: BaseDirectory.AppData,
    });
    const projects = JSON.parse(projectsString) as Project[];
    return projects;
}

export async function getConfigData() {
    const configString = await readTextFile(`config.json`, {
        dir: BaseDirectory.AppData,
    });
    const config = JSON.parse(configString) as { [key: string]: string };
    return config;
}

export async function addProjectData(path: string) {
    setAllProjects((prev) => [
        ...prev,
        {
            name: path.split("\\").pop() ?? "Unknown",
            path,
            lastOpened: Date.now(),
        },
    ]);
    saveProjectsData();
}

export async function addFolderData(path: string) {
    const dirs = await readDir(path);
    let newProjs: Project[] = [];
    for (const proj of allProjects()) {
        for (let dir of dirs) {
            if (proj.path === dir.path) {
                dirs.splice(dirs.indexOf(dir), 1);
            }
        }
    }
    for (let dir of dirs) {
        console.log(dir);
        newProjs.push({
            name: dir.path.split("\\").pop() ?? "Unknown",
            path: dir.path,
            lastOpened: 0,
        });
    }
    setAllProjects((prev) => {
        return [...newProjs, ...prev];
    });
    saveProjectsData();
}

async function getProjects() {
    const projects = await getProjectsData();
    projects.sort((a, b) => {
        return b.lastOpened - a.lastOpened;
    });
    setAllProjects(projects);
}

export async function initialStart() {
    const dataDir = await appDataDir();
    const hasAppDir = await exists(dataDir);
    if (!hasAppDir) {
        await createDir(dataDir);
    }
    const hasScriptSave = await exists(`projects.json`, {
        dir: BaseDirectory.AppData,
    });
    const hasConfig = await exists(`config.json`, { dir: BaseDirectory.AppData });
    if (!hasScriptSave) {
        await writeTextFile(`projects.json`, JSON.stringify([]), {
            dir: BaseDirectory.AppData,
        });
    }
    if (!hasConfig) {
        await writeTextFile(
            "config.json",
            JSON.stringify(configStore),
            { dir: BaseDirectory.AppData }
        );
        setHasInitialized(false);
    }
    getProjects();
    const config = await getConfigData();
    for (let item of Object.keys(config)) {
        if (config[item] !== "") {
            const valid = await exists(config[item]);
            if (valid) {
                setHasInitialized(true);
                break;
            }
        }
    }
    setConfigStore(config);
}
