import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LabelService } from '../../shared/services/label.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Label } from '../../shared/models/label';
import { ExperienceService } from '../../shared/services/experience.service';

@Component({
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelDetailComponent {
  label$: Observable<Label | undefined>;
  childLabels$: Observable<Label[]>;

  constructor(
    private labelService: LabelService,
    private route: ActivatedRoute,
    private router: Router,
    private experienceService: ExperienceService
  ) {
    const labelId$ = this.route.params.pipe(map((params) => params['labelId']));
    this.label$ = labelId$.pipe(
      switchMap((labelId) => this.labelService.getLabelById(labelId))
    );
    this.childLabels$ = labelId$.pipe(
      switchMap((labelId) => this.labelService.getChildLabels(labelId))
    );
  }

  async onSubLabelClicked(label: Label) {
    await this.router.navigate(['..', label.id], { relativeTo: this.route });
  }

  async showExercisesForLabel(label: Label) {
    await this.router.navigate(['exercises'], {
      queryParams: { labelId: label.id },
    });
  }

  async study() {
    await this.experienceService.updateExperiencesTable();
    await this.router.navigate(['study'], { relativeTo: this.route });
  }

  async onLabelImageClicked(label: Label) {
    await this.router.navigate(['local-assets', label.localImageId]);
  }
}
