import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  delay,
  merge,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-copy-text-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copy-text-button.component.html',
  styleUrls: ['./copy-text-button.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyTextButtonComponent {
  @Input() text!: string;

  successfullyCopied = new Subject();

  indicateCopied$ = this.successfullyCopied.pipe(
    switchMap(() => merge(of(true), of(false).pipe(delay(3000)))),
    startWith(false),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  async onClick() {
    await navigator.clipboard.writeText(this.text);
    this.successfullyCopied.next({});
  }
}
