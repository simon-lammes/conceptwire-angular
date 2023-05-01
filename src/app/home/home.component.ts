import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LabelService } from '../shared/services/label.service';
import { Label } from '../shared/models/label';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(protected labelService: LabelService, protected router: Router) {}

  async onLabelClicked(label: Label) {
    await this.router.navigate(['labels', label.id, 'study']);
  }
}
