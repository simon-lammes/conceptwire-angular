import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-button.component.html',
  styleUrls: ['./file-button.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileButtonComponent {
  @Input()
  title?: string;

  @Input()
  highlighted = false;

  @Output()
  clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
