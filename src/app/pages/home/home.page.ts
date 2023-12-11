import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<app-button (click)="logout()">Logout</app-button>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly supabase = inject(SupabaseClient);

  readonly router = inject(Router);

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    await this.router.navigateByUrl('/auth');
  }
}
