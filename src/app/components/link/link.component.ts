import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a
      class="font-medium text-indigo-500 hover:text-indigo-600"
      [routerLink]="routerLink"
      [relativeTo]="relativeTo"
      ><ng-content
    /></a>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  @Input()
  routerLink?: any[] | string;

  @Input()
  relativeTo?: ActivatedRoute;
}
