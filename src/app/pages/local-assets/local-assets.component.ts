import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from '../../models/asset';
import { LocalAssetUrlPipe } from '../../pipes/local-asset-url.pipe';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-local-assets',
  templateUrl: './local-assets.component.html',
  styleUrls: ['./local-assets.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ToolbarComponent, LocalAssetUrlPipe, IonicModule],
})
export class LocalAssetsComponent {
  constructor(
    protected assetService: AssetService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onAssetClicked(asset: Asset) {
    this.router.navigate([asset.id], { relativeTo: this.route });
  }
}
