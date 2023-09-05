import { BaseDirectory, createDir, exists, readDir, writeTextFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { getProjectsData } from "./data";
import { setAllProjects } from "./state";

export async function initialStart() {
    const dataDir = await appDataDir();
    const hasAppDir = await exists(dataDir);
    if(!hasAppDir) {
        await createDir(dataDir);
    }
    const hasScriptSave = await exists(`projects.json`, { dir: BaseDirectory.AppData });
    if(!hasScriptSave) {
        await writeTextFile(`projects.json`, JSON.stringify([]), {dir: BaseDirectory.AppData});
    }
    const projects = await getProjectsData();
    projects.sort((a, b) => { return b.lastOpened - a.lastOpened });
    setAllProjects(projects);
}