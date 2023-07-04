import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  switchMap,
  take,
} from 'rxjs';
import { ExerciseService } from '../../../shared/services/exercise.service';
import { ExperienceService } from '../../../shared/services/experience.service';
import { ExerciseSituation } from '../../../shared/models/exercise-situation';
import { ExerciseResult } from '../../../shared/models/exerciseResult';
import { LabelService } from '../../../shared/services/label.service';
import { Label } from '../../../shared/models/label';
import { ExerciseSituationComponent } from '../../../shared/components/exercise-situation/exercise-situation.component';
import { StudyProgressComponent } from '../../../shared/components/study-progress/study-progress.component';
import { PaddedLayoutComponent } from '../../../shared/components/padded-layout/padded-layout.component';
import { CommonModule } from '@angular/common';
import {
  AdditionalToolbarAction,
  ToolbarComponent,
} from '../../../shared/components/toolbar/toolbar.component';
import { BookPossessionService } from '../../../shared/services/book-possession.service';
import { IonicModule } from '@ionic/angular';
import { ExercisePreviewComponent } from '../../../shared/components/exercise-preview/exercise-preview.component';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    PaddedLayoutComponent,
    StudyProgressComponent,
    ExerciseSituationComponent,
    IonicModule,
    ExercisePreviewComponent,
  ],
})
export class StudyComponent {
  readonly additionalToolbarActions: AdditionalToolbarAction[] = [
    {
      icon: 'play-skip-forward-outline',
      label: 'Skip',
      action: () => this.skipExercise(),
    },
    {
      icon: 'information-circle-outline',
      label: 'Details',
      action: () => {
        this.showExerciseDetails$.next(true);
      },
    },
  ];
  showExerciseDetails$ = new BehaviorSubject(false);
  nextExerciseRequested$ = new BehaviorSubject<true>(true);
  labelId$ = this.route.params.pipe(
    map((params) => params['labelId'] as string)
  );
  experience$ = combineLatest([
    this.labelId$,
    this.bookPossessionService.booksInPossessionByIsbn13$,
  ]).pipe(
    switchMap(([labelId, availableBooksByIsbn13]) =>
      this.experienceService.getExperienceStreamForStudying({
        labelId,
        availableBooksByIsbn13,
      })
    )
  );
  exerciseSituation$ = this.nextExerciseRequested$.pipe(
    switchMap(() => this.experience$.pipe(take(1))),
    switchMap((experience) =>
      this.exerciseService.getExerciseById(experience?.exerciseId).pipe(
        map((exercise) => {
          if (!exercise) return undefined;
          return <ExerciseSituation>{ exercise, experience };
        })
      )
    )
  );
  label$: Observable<Label | undefined> = this.labelId$.pipe(
    switchMap((labelId) => this.labelService.getLabelById(labelId))
  );
  studyProgress$ = combineLatest([
    this.labelId$,
    this.experience$,
    this.bookPossessionService.booksInPossessionByIsbn13$,
  ]).pipe(
    switchMap(([labelId, experience, booksInPossessionByIsbn13]) =>
      this.experienceService.getStudyProgress(
        labelId,
        experience,
        booksInPossessionByIsbn13
      )
    )
  );
  readonly labelsOfExercise$ = this.experience$.pipe(
    switchMap((experience) =>
      this.labelService.getLabelsOfExercise(experience?.exerciseId)
    )
  );

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService,
    private exerciseService: ExerciseService,
    private labelService: LabelService,
    private bookPossessionService: BookPossessionService
  ) {}

  async onExerciseResult(exerciseResult: ExerciseResult) {
    const labelId = await firstValueFrom(this.labelId$);
    await this.experienceService.onExerciseResult(exerciseResult, labelId);
  }

  onNextExerciseRequested() {
    this.nextExerciseRequested$.next(true);
  }

  private async skipExercise() {
    const labelId = await firstValueFrom(this.labelId$);
    const exerciseSituation = await firstValueFrom(this.exerciseSituation$);
    if (!exerciseSituation) return;
    await this.experienceService.onExerciseResult(
      {
        exerciseSituation: exerciseSituation,
        feedback: 'skip',
      },
      labelId
    );
    this.nextExerciseRequested$.next(true);
  }
}
