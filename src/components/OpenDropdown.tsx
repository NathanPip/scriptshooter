import { Component, createEffect, createSignal } from "solid-js";
import Dropdown from "./Dropdown";
import { configStore } from "../data";
import { allProjects } from "../state";
import { openProjectHandler } from "../App";
import { openNvimHandler } from "../App";

const OpenDropdown: Component = () => {

   const [buttons, setButtons] = createSignal([{title: "Most Recent", clickEvent: () => {openProjectHandler("nvim", allProjects()[0])}}]); 

    createEffect(() => {
        if(configStore.config) {
            setButtons([
            {title: "Most Recent", clickEvent: () => {openProjectHandler("nvim", allProjects()[0])}}, 
            {title: "Nvim Config", clickEvent: () => {openNvimHandler(configStore.config)}}]);
        }
    })

    return (
        <Dropdown title="Open" buttons={buttons()} />
    )
}

export default OpenDropdown;
