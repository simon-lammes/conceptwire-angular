import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NavigationRailComponent } from "./navigation-rail/navigation-rail.component";
import { RouterOutlet } from "@angular/router";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [NavigationRailComponent, RouterOutlet, DividerModule],
  template: `
    <div class="flex h-full">
      <app-navigation-rail />
      <div class="h-full flex-grow overflow-auto">
        <router-outlet />
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
