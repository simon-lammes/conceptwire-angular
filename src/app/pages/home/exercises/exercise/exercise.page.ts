import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { ExerciseService } from "../../../../services/exercise.service";
import { ToolbarComponent } from "../../../../components/toolbar/toolbar.component";

@Component({
  selector: "app-exercise",
  standalone: true,
  imports: [ToolbarComponent],
  template: `
    <app-toolbar title="Exercise">
      <ng-container end>
        <a
          href="jetbrains://web-storm/navigate/reference?project=conceptwire-angular&path=src/app/pages/home/exercises/exercise/exercise.page.ts"
        >
          open in webstorm
        </a>
      </ng-container>
    </app-toolbar>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisePage {
  readonly route = inject(ActivatedRoute);

  readonly exerciseService = inject(ExerciseService);

  readonly exerciseId$ = this.route.params.pipe(
    map((params) => params["exerciseId"]),
  );

  readonly exercise$ = this.exerciseId$.pipe(
    map((exerciseId) => this.exerciseService.getExerciseById(exerciseId)),
  );
}
