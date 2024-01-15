import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuItem } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { LocalEditorSettingsComponent } from "./local-editor-settings/local-editor-settings.component";
import { LocalEditingService } from "../../services/local-editing.service";

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

  constructor(private localEditingService: LocalEditingService) {}

  async open() {
    await this.localEditingService.editTempFileLocally({
      fileName: "exercise.html",
    });
  }
}
