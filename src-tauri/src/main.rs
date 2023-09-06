// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::os::windows::process::CommandExt;
use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hekkl, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_nvim(nvim: &str, path: &str) {
    Command::new(nvim)
        .raw_arg(path)
        .current_dir(path)
        .creation_flags(0x00000010)
        .spawn()
        .expect("failed to open nvim");
    println!("{:?}", whoami::username());
}

#[tauri::command]
fn open_vs(vs: &str, path: &str) {
    Command::new(vs)
        .raw_arg(path)
        .current_dir(path)
        .creation_flags(0x00000010)
        .spawn()
        .expect("failed to open vscode");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, open_nvim, open_vs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
