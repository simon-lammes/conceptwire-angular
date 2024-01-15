import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { InputTextComponent } from "../../input-text/input-text.component";
import { LocalSettingsService } from "../../../services/local-settings.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import {
  DirectoryValidator,
  FolderInputComponent,
} from "../../folder-input/folder-input.component";

@UntilDestroy()
@Component({
  selector: "app-local-editor-settings",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent, FolderInputComponent],
  template: `
    <div>
      <div class="pb-6">
        Pick the root directory of a webstorm project. We will automatically
        validate whether it is a valid webstorm project.
      </div>
      <app-folder-input
        [formControl]="form.controls.projectDirectory"
        label="Project Directory"
        [errors]="form.controls.projectDirectory.errors"
        [folderValidator]="directoryValidator"
      />
      <div class="pt-6">Your settings are automatically saved locally.</div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalEditorSettingsComponent {
  readonly fb = inject(FormBuilder);

  readonly localSettingsService = inject(LocalSettingsService);

  readonly form = this.fb.group({
    projectDirectory: this.fb.control<FileSystemDirectoryHandle | null>(null),
  });

  /**
   * The consumer can decide which directories will be accepted.
   */
  readonly directoryValidator: DirectoryValidator = async (directory) => {
    try {
      const ideaFolder = await directory.getDirectoryHandle(".idea");
      for await (const key of ideaFolder.keys()) {
        if (key.endsWith(".iml")) {
          return undefined;
        }
      }
      return {
        rejectionMessage: "Could not find an expected file ending with .iml.",
      };
    } catch (e) {
      return {
        rejectionMessage: "Could not find .idea folder",
      };
    }
  };

  constructor() {
    this.init();
  }

  private async init() {
    const localSettings = await this.localSettingsService.getLocalSettings();
    if (localSettings) {
      this.form.patchValue(localSettings);
    }
    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) =>
        this.localSettingsService.patchLocalSettings(value),
      );
  }
}
