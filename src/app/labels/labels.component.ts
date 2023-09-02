import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LabelService } from '../shared/services/label.service';
import { Observable } from 'rxjs';
import { Label } from '../shared/models/label';
import { ActivatedRoute, Router } from '@angular/router';
import { lab } from 'd3';
import { LabelComponent } from '../shared/components/label/label.component';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ToolbarComponent, LabelComponent, IonicModule],
})
export class LabelsComponent {
  readonly labels$: Observable<Label[]>;

  constructor(
    private labelService: LabelService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.labels$ = this.labelService.labels$;
  }

  async onLabelClicked(label: Label) {
    await this.router.navigate([label.id], { relativeTo: this.route });
  }

  protected readonly lab = lab;
}
