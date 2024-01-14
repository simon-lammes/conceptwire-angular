import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ExerciseService } from "../../../services/exercise.service";
import { AsyncPipe, JsonPipe } from "@angular/common";

@Component({
  selector: "app-exercises",
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  template: `
    @if (exerciseQuery$ | async; as query) {
      @if (query.data; as exercises) {
        {{ exercises | json }}
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesPage {
  readonly exerciseService = inject(ExerciseService);

  readonly exerciseQuery$ = this.exerciseService.getExercisesQuery().result$;
}
