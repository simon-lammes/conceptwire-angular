import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Label } from '../../models/label';
import { LocalAssetUrlPipe } from '../../pipes/local-asset-url.pipe';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule, LocalAssetUrlPipe],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  @Input()
  label!: Label;

  @Output()
  clicked = new EventEmitter<MouseEvent>();

  onClicked(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
