import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { InputTextComponent } from "../../input-text/input-text.component";
import { LocalSettingsService } from "../../../services/local-settings.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "app-local-editor-settings",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
  template: `
    <div>
      <app-input-text
        [formControl]="form.controls.projectName"
        name="Project Name"
      />
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
  });

  constructor() {
    const localSettings = this.localSettingsService.getLocalSettings();
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
