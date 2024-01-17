import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, switchMap } from "rxjs";
import { ExerciseService } from "../../../../services/exercise.service";
import { ToolbarComponent } from "../../../../components/toolbar/toolbar.component";
import { OpenHtmlExternallyButtonComponent } from "../../../../components/open-html-externally-button/open-html-externally-button.component";
import { ExerciseComponent } from "../../../../components/exercise/exercise.component";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-exercise-detail",
  standalone: true,
  imports: [
    ToolbarComponent,
    OpenHtmlExternallyButtonComponent,
    ExerciseComponent,
    AsyncPipe,
  ],
  template: `
    <app-toolbar title="Exercise">
      <ng-container end>
        <app-open-html-externally-button />
      </ng-container>
    </app-toolbar>
    <div>
      @if (exerciseQuery$ | async; as query) {
        @if (query.data; as exercise) {
          <app-exercise [exerciseContent]="exercise.content" />
        }
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailPage {
  readonly route = inject(ActivatedRoute);

  readonly exerciseService = inject(ExerciseService);

  readonly exerciseId$ = this.route.params.pipe(
    map((params) => params["exerciseId"]),
  );

  readonly exerciseQuery$ = this.exerciseId$.pipe(
    switchMap(
      (exerciseId) => this.exerciseService.getExerciseById(exerciseId).result$,
    ),
  );
}
