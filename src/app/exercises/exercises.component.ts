import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, startWith, switchMap } from 'rxjs';
import { Exercise } from '../shared/models/exercise';
import { ExerciseService } from '../shared/services/exercise.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BindQueryParamsFactory } from '@ngneat/bind-query-params';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesComponent implements OnDestroy {
  exercises$: Observable<Exercise[]>;
  labelIdControl = new FormControl<string | undefined>(undefined);
  searchControl = new FormControl('');
  filters = new FormGroup({
    search: this.searchControl,
    labelId: this.labelIdControl,
  });

  /**
   * Must be destroyed to prevent memory leaks.
   * Makes sure that the URL query params are in sync with the control on the page.
   */
  bindQueryParamsManager = this.factory
    .create([{ queryKey: 'search' }, { queryKey: 'labelId' }])
    .connect(this.filters);

  constructor(
    private exerciseService: ExerciseService,
    private factory: BindQueryParamsFactory,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const query$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value)
    );
    const labelId$ = this.labelIdControl.valueChanges.pipe(
      startWith(this.labelIdControl.value)
    );
    this.exercises$ = combineLatest([labelId$, query$]).pipe(
      switchMap(([labelId, query]) =>
        this.exerciseService.searchExercises({
          query,
          labelId,
        })
      )
    );
  }

  ngOnDestroy() {
    this.bindQueryParamsManager.destroy();
  }

  async navigateToExercise(exercise: Exercise) {
    await this.router.navigate([exercise.id], { relativeTo: this.route });
  }
}
