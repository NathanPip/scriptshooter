import { Component } from "solid-js";
import Dropdown from "./Dropdown";
import { addFolderHandler, addProjectHandler } from "./Main";

const AddDropdown: Component = () => {

    const buttons = [{title: "New Project", clickEvent: addProjectHandler}, {title: "Open Folder", clickEvent: addFolderHandler}];

    return (
        <Dropdown title="Add" buttons={buttons} />
    )
}

export default AddDropdown;
