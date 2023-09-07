import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Output()
  clicked = new EventEmitter<MouseEvent>();

  @Input()
  title!: string;

  @Input()
  fontawesomeIconClasses!: string | string[];

  @Input()
  color: 'danger' | 'default' = 'default';
}
