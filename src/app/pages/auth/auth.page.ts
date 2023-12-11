import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LinkComponent } from '../../components/link/link.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseClient } from '@supabase/supabase-js';

@Component({
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    LinkComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <form
      class="max-w-lg m-auto p-4 space-y-6"
      [formGroup]="form"
      (ngSubmit)="login()"
    >
      <app-input
        id="email"
        label="Email"
        placeholder="you@example.com"
        inputType="email"
        [formControl]="form.controls.email"
      />
      <app-input
        id="password"
        label="Password"
        inputType="password"
        [formControl]="form.controls.password"
      />
      <div class="w-full">
        <app-button [fullWidth]="true" type="submit">Login</app-button>
      </div>
      <div class="text-center">
        <span>No account yet?</span
        ><app-link class="ml-1" routerLink="registration" [relativeTo]="route"
          >Create Account</app-link
        >
      </div>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {
  readonly route = inject(ActivatedRoute);

  readonly router = inject(Router);

  readonly formBuilder = inject(FormBuilder);

  readonly supabase = inject(SupabaseClient);

  readonly form = this.formBuilder.group({
    email: this.formBuilder.control(''),
    password: this.formBuilder.control(''),
  });

  async login() {
    const {
      data: { session },
    } = await this.supabase.auth.signInWithPassword({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });
    if (session) {
      await this.router.navigate(['/home']);
    }
  }
}
