import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { allProjects, setAllProjects } from "./state";

export type Project = {
  name: string;
  path: string;
  lastOpened: Date;
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
      lastOpened: new Date(),
    },
  ]);
  saveProjectsData();
}
