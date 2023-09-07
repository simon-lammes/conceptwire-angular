import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { GithubSynchronizationService } from '../../../services/github-synchronization.service';
import { valueChangesOfControl } from '../../../helpers/rxjs/value-changes-of-control';
import { Procedure } from '../../../models/procedure';
import { ProcedureButtonComponent } from '../../../components/procedure-button/procedure-button.component';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaddedLayoutComponent } from '../../../components/padded-layout/padded-layout.component';
import { ToolbarComponent } from '../../../components/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-github-synchronization',
  templateUrl: './github-synchronization.component.html',
  styleUrls: ['./github-synchronization.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    PaddedLayoutComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ProcedureButtonComponent,
    IonicModule,
  ],
})
export class GithubSynchronizationComponent {
  readonly userControl = new FormControl('simon-lammes');
  readonly repoControl = new FormControl('conceptwire-content');
  readonly branchControl = new FormControl(undefined);
  readonly userValue$ = valueChangesOfControl(this.userControl);
  readonly repoControl$ = valueChangesOfControl(this.repoControl);
  readonly branches$ = combineLatest([this.userValue$, this.repoControl$]).pipe(
    switchMap(([user, repo]) =>
      user && repo
        ? this.githubSynchronizationService.octokit.rest.repos.listBranches({
            owner: user,
            repo,
          })
        : of(undefined),
    ),
    map((response) => response?.data.map((x) => x.name)),
  );
  readonly importProcedure: Procedure = {
    name: 'Import',
    icon: 'download',
    executor: () => this.onSubmit(),
  };

  constructor(
    protected githubSynchronizationService: GithubSynchronizationService,
  ) {}

  async onSubmit() {
    const owner = this.userControl.value;
    const repo = this.repoControl.value;
    const ref = this.branchControl.value;
    if (!owner || !repo || !ref) throw Error('Value Null');
    await this.githubSynchronizationService.importContent({
      owner: owner,
      repo: repo,
      ref: ref,
    });
  }
}
