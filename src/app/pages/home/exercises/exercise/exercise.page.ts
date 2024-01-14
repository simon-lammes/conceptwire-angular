import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { ExerciseService } from "../../../../services/exercise.service";
import { ToolbarComponent } from "../../../../components/toolbar/toolbar.component";
import { OpenHtmlExternallyButtonComponent } from "../../../../components/open-html-externally-button/open-html-externally-button.component";

@Component({
  selector: "app-exercise",
  standalone: true,
  imports: [ToolbarComponent, OpenHtmlExternallyButtonComponent],
  template: `
    <app-toolbar title="Exercise">
      <ng-container end>
        <app-open-html-externally-button />
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
