import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AssetService } from '../shared/services/asset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from '../shared/models/asset';

@Component({
  selector: 'app-local-assets',
  templateUrl: './local-assets.component.html',
  styleUrls: ['./local-assets.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalAssetsComponent {
  constructor(
    protected assetService: AssetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onAssetClicked(asset: Asset) {
    this.router.navigate([asset.id], { relativeTo: this.route });
  }
}
