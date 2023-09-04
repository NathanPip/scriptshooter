import { BaseDirectory, readDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { allProjects, setAllProjects } from "./state";

export type Project = {
  name: string;
  path: string;
  lastOpened: number;
};

export async function saveProjectsData() {
  await writeTextFile(`projects.json`, JSON.stringify(allProjects()), {
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
  let newProjs: Project[] = []
  for(const proj of allProjects()) {
    for(let dir of dirs) {
      if(proj.path === dir.path) {
        dirs.splice(dirs.indexOf(dir), 1);
      }
    }
  } 
  for(let dir of dirs) {
    console.log(dir);
    newProjs.push({
      name: dir.path.split("\\").pop() ?? "Unknown",
      path: dir.path,
      lastOpened: 0,
    })
  }
  setAllProjects((prev) => {
    return [...newProjs, ...prev];
  })
  saveProjectsData(); 
}
