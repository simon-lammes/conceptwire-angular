import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  template: `
    <div class="max-w-lg m-auto p-4 space-y-6">
      <app-input
        id="email"
        label="Email"
        placeholder="you@example.com"
        inputType="email"
      />
      <app-input id="password" label="Password" inputType="password" />
      <div class="w-full">
        <app-button [rounded]="true" [fullWidth]="true">Login</app-button>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {}
