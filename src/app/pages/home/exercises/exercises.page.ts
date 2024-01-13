import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [],
  template: `
    <p>
      exercises works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesPage {

}
