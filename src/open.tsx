import { ActionPanel, Action, Icon, List, getPreferenceValues } from "@raycast/api";
import fs from "fs";

const { workspacesPath }: ExtensionPreferences = getPreferenceValues();
const files = fs.readdirSync(workspacesPath);

const WORKSPACES = files
  .filter((file) => file.includes("code-workspace"))
  .map((workspaceFile, idx) => {
    return {
      id: idx,
      title: workspaceFile.replace(".code-workspace", ""), // remove suffix
      accessory: workspaceFile,
      path: `${workspacesPath}/${workspaceFile}`,
    };
  });

export default function Command() {
  return (
    <List>
      {WORKSPACES.map((item) => (
        <List.Item
          key={item.id}
          icon="list-icon.png"
          title={item.title}
          // subtitle={item.subtitle}
          accessories={[{ icon: Icon.AppWindow, text: item.accessory }]}
          actions={
            <ActionPanel>
              <Action.Open title="Open in Code" target={item.path} />
              <Action.ShowInFinder path={item.path}></Action.ShowInFinder>
              <Action.Open
                title="Open in Zed"
                target={item.path}
                application={"Zed"} // TODO let user choose the replacement, instead of hard-coding Zed
                shortcut={{ modifiers: ["cmd"], key: "z" }}
              />
              <Action.CopyToClipboard content={item.path} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
