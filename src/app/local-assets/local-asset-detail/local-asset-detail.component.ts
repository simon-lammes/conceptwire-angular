import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AssetAttributionService } from '../../shared/services/asset-attribution.service';

@Component({
  selector: 'app-local-asset-detail',
  templateUrl: './local-asset-detail.component.html',
  styleUrls: ['./local-asset-detail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
