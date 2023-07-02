import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

export interface AdditionalToolbarAction {
  icon: string;
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    IonicModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToolbarComponent {
  @Input()
  title!: string;

  @Input()
  showUploadButton = false;

  @Input()
  additionalActions?: AdditionalToolbarAction[];

  constructor(private router: Router, private route: ActivatedRoute) {}

  async goBack() {
    // We prefer using the supreme navigation api.
    // @ts-ignore
    if (window.navigation?.canGoBack) {
      // @ts-ignore
      window.navigation.back();
      return;
    }
    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
