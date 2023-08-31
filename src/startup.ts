import { createDir, exists, readDir, writeTextFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

export async function initialStart() {
    const appdata = await appDataDir();
    const hasDir = await exists(`${appdata}/scriptshooter`);
    const hasScriptSave = await exists(`${appdata}/scriptshooter/scripts.json`);
    if(!hasDir) {
        await createDir(`${appdata}/scriptshooter`);
    }
    if(!hasScriptSave) {
        await writeTextFile(`${appdata}/scriptshooter/scripts.json`, JSON.stringify([]));
    }
}