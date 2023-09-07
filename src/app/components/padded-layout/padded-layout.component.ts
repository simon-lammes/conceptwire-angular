import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-padded-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './padded-layout.component.html',
  styleUrls: ['./padded-layout.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddedLayoutComponent {}
