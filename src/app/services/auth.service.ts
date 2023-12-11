import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { shareSingleton } from '../lib/rxjs/share-singleton';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly supabase = inject(SupabaseClient);

  readonly isAuthenticated$ = new Observable((subscriber) => {
    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((_, session) =>
      subscriber.next(!!session),
    );
    this.supabase.auth
      .getSession()
      .then(({ data: { session } }) => subscriber.next(!!session));
    return () => {
      subscription.unsubscribe();
    };
  }).pipe(shareSingleton());
}
