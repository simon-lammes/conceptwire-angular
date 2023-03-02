import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudySession } from '../../models/study-session';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-study-session',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudySessionComponent {
  @Input()
  studySession!: StudySession;

  @Output()
  clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
