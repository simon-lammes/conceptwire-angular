import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StudySettingsService } from '../shared/services/study-settings.service';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CooldownPreviewComponent } from '../shared/components/cooldown-preview/cooldown-preview.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ToolbarComponent,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CooldownPreviewComponent,
    MatButtonModule,
    IonicModule,
  ],
})
export class SettingsComponent implements OnInit {
  immediatelyJumpToNextExerciseAfterGivingFeedbackControl = new FormControl<
    boolean | undefined
  >(undefined);

  cooldownFormulaControl = new FormControl<string>('');

  form = new FormGroup({
    immediatelyJumpToNextExerciseAfterGivingFeedback:
      this.immediatelyJumpToNextExerciseAfterGivingFeedbackControl,
    cooldownFormula: this.cooldownFormulaControl,
  });

  constructor(private studySettingsService: StudySettingsService) {}

  ngOnInit(): void {
    firstValueFrom(this.studySettingsService.studySettings$).then(
      (studySettings) => {
        if (!studySettings) return;
        this.form.patchValue(studySettings);
      }
    );
  }

  onSubmit() {
    this.studySettingsService.put({
      immediatelyJumpToNextExerciseAfterGivingFeedback:
        this.immediatelyJumpToNextExerciseAfterGivingFeedbackControl.value ??
        false,
      cooldownFormula: this.cooldownFormulaControl.value ?? '',
      id: 'my-study-settings',
    });
  }
}
