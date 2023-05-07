import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AssetAttributionService } from '../../shared/services/asset-attribution.service';
import { LocalAssetUrlPipe } from '../../shared/pipes/local-asset-url.pipe';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-local-asset-detail',
  templateUrl: './local-asset-detail.component.html',
  styleUrls: ['./local-asset-detail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ToolbarComponent, LocalAssetUrlPipe],
})
export class LocalAssetDetailComponent {
  assetId$: Observable<string> = this.route.params.pipe(
    map((params) => params['assetId'])
  );
  assetAttribution$ = this.assetId$.pipe(
    switchMap((assetId) =>
      this.assetAttributionService.getAssetAttribution(assetId)
    )
  );

  constructor(
    private route: ActivatedRoute,
    private assetAttributionService: AssetAttributionService
  ) {}
}
