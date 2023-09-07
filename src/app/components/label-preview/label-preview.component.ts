import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalAssetUrlPipe } from '../../pipes/local-asset-url.pipe';
import { Label } from '../../models/label';
import { CopyTextButtonComponent } from '../copy-text-button/copy-text-button.component';

@Component({
  selector: 'app-label-preview',
  standalone: true,
  imports: [CommonModule, LocalAssetUrlPipe, CopyTextButtonComponent],
  templateUrl: './label-preview.component.html',
  styleUrls: ['./label-preview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelPreviewComponent {
  @Input()
  label!: Label;

  @Input()
  subLabels: Label[] = [];

  @Output()
  labelClicked = new EventEmitter<Label>();

  onLabelClicked(label: Label) {
    this.labelClicked.emit(label);
  }
}
