import { createSignal } from "solid-js";
import { Project } from "./data";

export const [allProjects, setAllProjects] = createSignal<Project[]>([]);