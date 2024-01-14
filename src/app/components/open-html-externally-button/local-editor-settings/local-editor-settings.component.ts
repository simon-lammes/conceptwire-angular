import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { InputTextComponent } from "../../input-text/input-text.component";
import { LocalSettingsService } from "../../../services/local-settings.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { FolderInputComponent } from "../../folder-input/folder-input.component";

@UntilDestroy()
@Component({
  selector: "app-local-editor-settings",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent, FolderInputComponent],
  template: `
    <div>
      <app-input-text
        [formControl]="form.controls.projectName"
        name="Project Name"
      />
      <app-folder-input [formControl]="form.controls.projectDirectory" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalEditorSettingsComponent {
  readonly fb = inject(FormBuilder);

  readonly localSettingsService = inject(LocalSettingsService);

  readonly form = this.fb.group({
    projectName: this.fb.control(""),
    projectDirectory: this.fb.control(null),
  });

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
