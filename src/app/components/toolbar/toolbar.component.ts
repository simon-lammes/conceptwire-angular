import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { BackButtonComponent } from './back-button/back-button.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ButtonModule, ToolbarModule, BackButtonComponent],
  template: `
    <p-toolbar
      class="sticky left-0 right-0 top-0 z-10"
      [style]="{ 'border-radius': 0, 'padding-block': '0.75rem' }"
    >
      <div class="p-toolbar-group-start">
        @if (defaultBackRoute) {
          <app-back-button class="mr-4" [defaultBackRoute]="defaultBackRoute" />
        }
        <h1 class="m-0 text-xl">{{ title }}</h1>
      </div>
      <div class="p-toolbar-group-center"></div>
      <div class="p-toolbar-group-end">
        <ng-content select="[end]"></ng-content>
      </div>
    </p-toolbar>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input({ required: true })
  title = '';

  @Input()
  defaultBackRoute?: string[];
}
