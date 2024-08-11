import { showHUD, Clipboard, LaunchProps, getPreferenceValues } from "@raycast/api";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

function createFolder(folderName: string): { error?: string; workspace: string } {
  if (!folderName) {
    throw new Error("No folder name provided.");
  }

  const preferences: ExtensionPreferences = getPreferenceValues();

  const folderPath = path.join(preferences.projectsPath, folderName);

  const workspace = path.join(preferences.workspacesPath, `${folderName}.code-workspace`);

  if (fs.existsSync(folderPath)) {
    return { error: `Folder '${folderName}' already exists.`, workspace };
  } else {
    fs.mkdirSync(folderPath);

    const content = JSON.stringify(
      {
        folders: [
          {
            path: folderPath,
          },
        ],
      },
      null,
      4,
    ); // Pretty-print with 4 spaces indentation

    fs.writeFileSync(workspace, content);
    Clipboard.copy(`folder created ${folderName}: ${folderPath}\n\nworkspace created ${workspace}`);
    return { workspace };
  }
}

function openWorkspace(workspaceName: string): string {
  if (!workspaceName) {
    throw new Error("Need to provide workspace name. Something went wrong.");
  }

  // FIXME use custom env or similar instead of hardcoding the code's path
  exec(`/opt/homebrew/bin/code ${workspaceName}`);

  return "";
}

export default async function main(props: LaunchProps<{ arguments: Arguments.Create }>) {
  const { folderName } = props.arguments;

  const { error, workspace } = createFolder(folderName);

  await showHUD(error ? error : `Created ${workspace}`);
  openWorkspace(workspace);
}
