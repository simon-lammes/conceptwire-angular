import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Procedure } from '../../models/procedure';

/**
 * Performs a procedure and provides feedback to the user on the progress.
 */
@Component({
  selector: 'app-procedure-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './procedure-button.component.html',
  styleUrls: ['./procedure-button.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcedureButtonComponent {
  @Input()
  procedure!: Procedure;

  state: 'initial' | 'loading' | 'finished' | 'error' = 'initial';

  constructor(private cd: ChangeDetectorRef) {}

  async onClicked() {
    this.state = 'loading';
    this.cd.markForCheck();
    try {
      await this.procedure.executor();
      this.state = 'finished';
      this.cd.markForCheck();
    } catch (e) {
      this.state = 'error';
      this.cd.markForCheck();
    }
  }
}
