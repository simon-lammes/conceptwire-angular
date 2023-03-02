import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LabelService } from '../../services/label.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MultiLabelInputComponent } from '../multi-label-input/multi-label-input.component';
import { MatCardModule } from '@angular/material/card';
import { Label } from '../../models/label';

@Component({
  selector: 'app-label-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MultiLabelInputComponent,
    MatCardModule,
  ],
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelFormComponent implements OnChanges {
  form: FormGroup;

  @Input()
  label?: Label;

  constructor(private fb: FormBuilder, private labelService: LabelService) {
    this.form = this.fb.group({
      id: this.fb.control(undefined),
      title: this.fb.control(''),
      description: this.fb.control(''),
      implicatedLabels: this.fb.control([]),
    });
  }

  ngOnChanges() {
    this.form.patchValue(this.label ?? {});
  }

  async onSubmit() {
    await this.labelService.saveLabel(this.form.value);
    this.form.reset();
  }
}
