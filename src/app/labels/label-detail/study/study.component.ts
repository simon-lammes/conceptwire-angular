import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ExerciseService } from '../../../shared/services/exercise.service';
import { ExperienceService } from '../../../shared/services/experience.service';
import { ExerciseSituation } from '../../../shared/models/exercise-situation';
import { ExerciseResult } from '../../../shared/models/exerciseResult';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.sass'],
})
export class StudyComponent {
  labelId$ = this.route.params.pipe(
    map((params) => params['labelId'] as string)
  );
  experience$ = this.labelId$.pipe(
    switchMap((labelId) =>
      this.experienceService.getExperienceStreamForStudying({ labelId })
    )
  );
  exerciseSituation$ = this.experience$.pipe(
    switchMap((experience) =>
      this.exerciseService.getExerciseById(experience?.exerciseId).pipe(
        map((exercise) => {
          if (!exercise) return undefined;
          return <ExerciseSituation>{ exercise, experience };
        })
      )
    )
  );

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService,
    private exerciseService: ExerciseService
  ) {}

  async onExerciseResult(exerciseResult: ExerciseResult) {
    await this.experienceService.onExerciseResult(exerciseResult);
  }
}
