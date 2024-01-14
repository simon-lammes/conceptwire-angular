import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  template: `
    <a [routerLink]="defaultBackRoute">
      <p-button
        icon="pi pi-arrow-left"
        severity="secondary"
        [rounded]="true"
        [text]="true"
      ></p-button>
    </a>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  @Input({ required: true })
  defaultBackRoute: string[] = [];
}
