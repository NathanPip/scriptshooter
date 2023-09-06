import { Component } from "solid-js";
import { openNvimHandler } from "../App";

const SettingsModal: Component = () => {
  return (
    <div class="w-full h-screen bg-opacity-80 bg-neutral-900 flex justify-center items-center absolute">
        <div>
            <h1>Settings</h1>
            <button onClick={() => {openNvimHandler("")}}>Edit NVIM config</button>
            <div></div>
        </div>
    </div>
  );
};

export default SettingsModal;
