import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { ObserveClassNameDirective } from "../../../directives/on-class-added.directive";
import { RouterLinkTracker } from "../../../models/router-link-tracker";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-navigation-rail",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    DividerModule,
    ObserveClassNameDirective,
    NgClass,
  ],
  template: `
    <div class="flex h-full">
      <div class="box-border flex h-full flex-col p-2">
        <nav class="flex flex-grow flex-col gap-2">
          @for (item of items; track item.route) {
            <a
              class="flex flex-col items-center rounded-md px-1 py-1 no-underline"
              [ngClass]="{
                'text-[--text-color]':
                  routerLinkTracker.activeLink() !== item.route,
                'bg-[--highlight-bg] text-[--highlight-text-color]':
                  routerLinkTracker.activeLink() === item.route
              }"
              [routerLink]="item.route"
              [routerLinkActive]="routerLinkTracker.routerLinkActiveClass"
              [appObserveClassName]="routerLinkTracker.routerLinkActiveClass"
              (classNameAdded)="routerLinkTracker.activeLink.set(item.route)"
            >
              <i class="pi text-2xl" [class]="[item.icon]"></i>
              <span class="text-sm">{{ item.name }}</span>
            </a>
          }
        </nav>
      </div>
      <p-divider class="z-10" layout="vertical"></p-divider>
    </div>
  `,

  styles: [
    `
      /* Although deprecated, using ng-deep (in combination with :host) is currently the best option:
       https://stackoverflow.com/questions/47024236/what-to-use-in-place-of-ng-deep */
      :host::ng-deep p-divider div {
        padding: 0;
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  readonly routerLinkTracker = new RouterLinkTracker();

  readonly items = [
    {
      route: "dashboard",
      name: "Dashboard",
      icon: "pi-home",
    },
    {
      route: "exercises",
      name: "Editor",
      icon: "pi-file-edit",
    },
  ];
}
