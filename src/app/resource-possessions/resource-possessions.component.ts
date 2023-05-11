import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-resource-possessions',
  standalone: true,
  imports: [CommonModule, ToolbarComponent],
  templateUrl: './resource-possessions.component.html',
  styleUrls: ['./resource-possessions.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcePossessionsComponent {}
