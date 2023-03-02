import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ExerciseService } from '../../shared/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.sass'],
})
export class ExerciseDetailComponent {
  exerciseId$ = this.route.params.pipe(map((params) => params['exerciseId']));

  exercise$ = this.exerciseId$.pipe(
    switchMap((exerciseId) => this.exerciseService.getExerciseById(exerciseId))
  );

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService
  ) {}
}
