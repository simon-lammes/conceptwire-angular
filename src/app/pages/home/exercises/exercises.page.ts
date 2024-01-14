import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ExerciseService } from "../../../services/exercise.service";
import { AsyncPipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-exercises",
  standalone: true,
  imports: [AsyncPipe, TableModule, RouterLink],
  template: `
    @if (exerciseQuery$ | async; as query) {
      @if (query.data; as exercises) {
        <p-table
          [value]="$any(exercises)"
          [tableStyle]="{ 'min-width': '50rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Id</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-exercise>
            <tr>
              <td>
                <a [routerLink]="[exercise.id]">{{ exercise.id }}</a>
              </td>
            </tr>
          </ng-template>
        </p-table>
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
