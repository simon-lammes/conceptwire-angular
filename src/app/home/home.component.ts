import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LabelService } from '../shared/services/label.service';
import { Label } from '../shared/models/label';
import { Router, RouterModule } from '@angular/router';
import { TileComponent } from '../shared/components/tile/tile.component';
import { LabelComponent } from '../shared/components/label/label.component';
import { CommonModule } from '@angular/common';
import { PaddedLayoutComponent } from '../shared/components/padded-layout/padded-layout.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { firstValueFrom, map } from 'rxjs';
import { ServiceWorkerService } from '../shared/services/service-worker.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PaddedLayoutComponent,
    RouterModule,
    CommonModule,
    LabelComponent,
    TileComponent,
    IonicModule,
  ],
})
export class HomeComponent {
  readonly lgBreakpoint$ = this.breakpointObserver
    .observe('(min-width: 1024px)')
    .pipe(map((x) => x.matches));

  constructor(
    protected labelService: LabelService,
    protected router: Router,
    private breakpointObserver: BreakpointObserver,
    protected serviceWorkerService: ServiceWorkerService
  ) {}

  async onLabelClicked(label: Label) {
    await this.router.navigate(['labels', label.id, 'study']);
  }

  async loadNewVersionIfAvailable() {
    const isAvailable =
      (await firstValueFrom(this.serviceWorkerService.isUpdateAvailable$)) ||
      (await this.serviceWorkerService.checkForUpdate());
    if (isAvailable) this.serviceWorkerService.activateUpdate();
  }
}
