import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LinkComponent } from '../../components/link/link.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [InputComponent, ButtonComponent, LinkComponent],
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
        <app-button [fullWidth]="true">Login</app-button>
      </div>
      <div class="text-center">
        <span>No account yet?</span
        ><app-link class="ml-1" routerLink="registration" [relativeTo]="route"
          >Create Account</app-link
        >
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {
  readonly route = inject(ActivatedRoute);
}
