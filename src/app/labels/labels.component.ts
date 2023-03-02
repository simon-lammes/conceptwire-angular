import { Component } from '@angular/core';
import { LabelService } from '../shared/services/label.service';
import { Observable } from 'rxjs';
import { Label } from '../shared/models/label';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.sass'],
})
export class LabelsComponent {
  readonly labels$: Observable<Label[]>;

  constructor(
    private labelService: LabelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.labels$ = this.labelService.labels$;
  }

  async onLabelClicked(label: Label) {
    await this.router.navigate([label.id], { relativeTo: this.route });
  }
}
