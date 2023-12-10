import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="max-w-lg m-auto p-4 space-y-4">
      <app-input />
      <app-input />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {}
