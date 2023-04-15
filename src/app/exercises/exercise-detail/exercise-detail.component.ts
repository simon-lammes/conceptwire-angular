import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { ExerciseService } from '../../shared/services/exercise.service';
import { Exercise } from '../../shared/models/exercise';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailComponent {
  exerciseId$ = this.route.params.pipe(map((params) => params['exerciseId']));

  exercise$: Observable<Exercise | undefined> = this.exerciseId$.pipe(
    switchMap((exerciseId) => this.exerciseService.getExerciseById(exerciseId))
  );

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService
  ) {}
}
