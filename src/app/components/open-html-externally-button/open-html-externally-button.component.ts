import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuItem } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { LocalEditorSettingsComponent } from "./local-editor-settings/local-editor-settings.component";
import { LocalSettingsService } from "../../services/local-settings.service";

@Component({
  selector: "app-open-html-externally-button",
  standalone: true,
  imports: [SplitButtonModule, DialogModule, LocalEditorSettingsComponent],
  template: `
    <p-splitButton
      label="Open"
      icon="pi pi-plus"
      (onClick)="open()"
      [model]="options"
    ></p-splitButton>
    <p-dialog
      header="Local Editor Settings"
      [style]="{ width: '50vw' }"
      [visible]="visible()"
      [dismissableMask]="true"
      [modal]="true"
      (visibleChange)="visible.set($event)"
    >
      <app-local-editor-settings />
    </p-dialog>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenHtmlExternallyButtonComponent {
  readonly options: MenuItem[] = [
    {
      label: "change settings",
      command: () => {
        this.visible.set(true);
      },
    },
  ];

  readonly visible = signal(false);

  constructor(private localSettingsService: LocalSettingsService) {}

  async open() {
    const settings = await this.localSettingsService.getLocalSettings();
    const projectDir = settings?.projectDirectory;
    if (!projectDir) {
      this.visible.set(true);
      return;
    }
    await projectDir.requestPermission({ mode: "readwrite" });
    const tempDir = await projectDir.getDirectoryHandle("temp", {
      create: true,
    });
    const file = await tempDir.getFileHandle("exercise.html", {
      create: true,
    });
    const writeable = await file.createWritable({ keepExistingData: false });
    await writeable.write("hello world");
    await writeable.close();
    window.open(
      `jetbrains://web-storm/navigate/reference?project=conceptwire-angular&path=temp/exercise.html`,
    );
  }
}
