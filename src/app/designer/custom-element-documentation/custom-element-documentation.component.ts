import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomElementDeclaration } from 'custom-elements-manifest';
import * as _ from 'lodash';
import { CustomElementTitlePipe } from '../../shared/pipes/custom-element-title.pipe';

@Component({
  selector: 'app-custom-element-documentation',
  standalone: true,
  imports: [CommonModule, CustomElementTitlePipe],
  templateUrl: './custom-element-documentation.component.html',
  styleUrls: ['./custom-element-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomElementDocumentationComponent implements OnChanges {
  @Input({ required: true })
  customElement!: CustomElementDeclaration;

  title = '';

  ngOnChanges(): void {
    this.title = _.startCase(this.customElement.name);
  }
}
