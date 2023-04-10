import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StudySettingsService } from '../shared/services/study-settings.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
