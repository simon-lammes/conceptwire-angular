import { Pipe, PipeTransform } from '@angular/core';
import { AssetService } from '../services/asset.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'localAssetUrl',
  standalone: true,
})
export class LocalAssetUrlPipe implements PipeTransform {
  constructor(
    private assetService: AssetService,
    private domSanitizer: DomSanitizer,
  ) {}

  async transform(
    assetId?: string | null,
  ): Promise<SafeResourceUrl | undefined> {
    if (!assetId) return undefined;
    const asset = await this.assetService.getAsset(assetId);
    if (!asset) return undefined;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(asset.blob),
    );
  }
}
