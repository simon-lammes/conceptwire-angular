import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  zip,
  combineLatest,
} from 'rxjs';
import { ExerciseService } from '../../../shared/services/exercise.service';
import { ExperienceService } from '../../../shared/services/experience.service';
import { ExerciseSituation } from '../../../shared/models/exercise-situation';
import { ExerciseResult } from '../../../shared/models/exerciseResult';
import { LabelService } from '../../../shared/services/label.service';
import { Label } from '../../../shared/models/label';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyComponent {
  nextExerciseRequested$ = new BehaviorSubject<true>(true);
  labelId$ = this.route.params.pipe(
    map((params) => params['labelId'] as string)
  );
  experience$ = this.labelId$.pipe(
    switchMap((labelId) =>
      this.experienceService.getExperienceStreamForStudying({ labelId })
    )
  );
  exerciseSituation$ = zip(
    this.experience$.pipe(
      switchMap((experience) =>
        this.exerciseService.getExerciseById(experience?.exerciseId).pipe(
          map((exercise) => {
            if (!exercise) return undefined;
            return <ExerciseSituation>{ exercise, experience };
          })
        )
      )
    ),
    this.nextExerciseRequested$
  ).pipe(map(([x]) => x));
  label$: Observable<Label | undefined> = this.labelId$.pipe(
    switchMap((labelId) => this.labelService.getLabelById(labelId))
  );
  studyProgress$ = combineLatest([this.labelId$, this.experience$]).pipe(
    switchMap(([labelId, experience]) =>
      this.experienceService.getStudyProgress(labelId, experience)
    )
  );

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService,
    private exerciseService: ExerciseService,
    private labelService: LabelService
  ) {}

  async onExerciseResult(exerciseResult: ExerciseResult) {
    await this.experienceService.onExerciseResult(exerciseResult);
  }

  onNextExerciseRequested() {
    this.nextExerciseRequested$.next(true);
  }
}
