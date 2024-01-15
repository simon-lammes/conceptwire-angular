import { Injectable } from "@angular/core";
import { LocalSettingsService } from "./local-settings.service";

@Injectable({
  providedIn: "root",
})
export class LocalEditingService {
  constructor(private localSettingsService: LocalSettingsService) {}

  async editTempFileLocally({ fileName }: { fileName: string }) {
    const settings = await this.localSettingsService.getLocalSettings();
    const projectDir = settings?.projectDirectory;
    if (!projectDir) {
      throw new Error("No project directory.");
    }
    await projectDir.requestPermission({ mode: "readwrite" });
    const tempDir = await projectDir.getDirectoryHandle("temp", {
      create: true,
    });
    const webStormProjectName = await this.getWebStormProjectName(projectDir);
    const file = await tempDir.getFileHandle(fileName, {
      create: true,
    });
    const writeable = await file.createWritable({ keepExistingData: false });
    await writeable.write("hello world nonsense");
    await writeable.close();
    window.open(
      `jetbrains://web-storm/navigate/reference?project=${webStormProjectName}&path=temp/${fileName}`,
    );
  }

  async getWebStormProjectName(projectDir: FileSystemDirectoryHandle) {
    const ideaFolder = await projectDir.getDirectoryHandle(".idea", {
      create: false,
    });
    for await (const key of ideaFolder.keys()) {
      if (key.endsWith(".iml")) {
        return key.slice(0, -4);
      }
    }
    throw new Error("No .iml file in .idea");
  }
}
