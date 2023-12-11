import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    {
      provide: SupabaseClient,
      useFactory: () =>
        createClient(
          'https://detstpnvrddskwwhopek.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldHN0cG52cmRkc2t3d2hvcGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMxOTM3MzYsImV4cCI6MTk4ODc2OTczNn0.jYqSnz-m6TAJKr5CeEbVJ0vEWgy_08kmTL20zuzgOCA',
        ),
    },
  ],
}).catch((err) => console.error(err));
