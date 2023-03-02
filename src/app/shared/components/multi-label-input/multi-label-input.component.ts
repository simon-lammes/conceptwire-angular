import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Label } from '../../models/label';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, Observable, switchMap } from 'rxjs';
import { LabelService } from '../../services/label.service';

@Component({
  selector: 'app-multi-label-input',
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './multi-label-input.component.html',
  styleUrls: ['./multi-label-input.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLabelInputComponent),
      multi: true,
    },
  ],
})
export class MultiLabelInputComponent implements ControlValueAccessor {
  @Input()
  label = '';

  @Input()
  placeholder = '';

  @ViewChild('input')
  labelsInput!: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  searchControl = new FormControl('');

  filteredLabels: Observable<Label[]>;

  selectedLabels: Label[] = [];

  onChange?: (selectedLabels: Label[]) => void;

  onTouched?: () => void;

  constructor(
    private labelService: LabelService,
    private cd: ChangeDetectorRef
  ) {
    this.filteredLabels = this.searchControl.valueChanges.pipe(
      switchMap((query) => this.labelService.searchLabels(query ?? '')),
      map((labels) =>
        labels.filter(
          (label) =>
            !this.selectedLabels.some(
              (implicatedLabel) => implicatedLabel.id === label.id
            )
        )
      )
    );
  }

  writeValue(labels: Label[]): void {
    this.selectedLabels = labels ?? [];
    this.cd.markForCheck();
  }

  registerOnChange(fn: (selectedLabels: Label[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  remove(label: Label) {
    this.selectedLabels = this.selectedLabels.filter((x) => x.id !== label.id);
    this.onChange && this.onChange(this.selectedLabels);
  }

  async add(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();
    const label = await this.labelService.getLabelByTitle(value);
    if (!label) {
      return;
    }
    this.selectedLabels = [...this.selectedLabels, label];
    event.chipInput?.clear();
    this.searchControl.setValue(null);
    this.onChange && this.onChange(this.selectedLabels);
  }

  async selected(event: MatAutocompleteSelectedEvent): Promise<void> {
    const label = await this.labelService.getLabelByTitle(
      event.option.viewValue
    );
    if (label) {
      this.selectedLabels.push(label);
    }
    this.labelsInput.nativeElement.value = '';
    this.searchControl.setValue(null);
    this.onChange && this.onChange(this.selectedLabels);
  }
}
