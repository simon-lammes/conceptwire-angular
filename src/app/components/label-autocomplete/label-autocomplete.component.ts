import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Label } from '../../models/label';
import { distinctUntilChanged, firstValueFrom, map, Observable } from 'rxjs';
import { LabelService } from '../../services/label.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

/**
 * Although this component may internally use the label object, its API (inwards and outwards) should only exchange the models
 * **ids**. That is because it is sometimes much easier to deal just with the id. For example, the id can be extracted
 * from the URL's query parameter which is not possible for a whole object.
 */
@UntilDestroy()
@Component({
  selector: 'app-label-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './label-autocomplete.component.html',
  styleUrls: ['./label-autocomplete.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelAutocompleteComponent),
      multi: true,
    },
  ],
})
export class LabelAutocompleteComponent implements ControlValueAccessor {
  filteredLabels$: Observable<Label[]>;
  control = new FormControl<Label | string>('');

  onChange?: (labelId?: string) => void;

  onTouched?: () => void;

  constructor(private labelService: LabelService) {
    this.filteredLabels$ = this.labelService.labels$;
    this.control.valueChanges
      .pipe(
        map((value) => {
          const hasLabelBeenSelected = value && typeof value !== 'string';
          return hasLabelBeenSelected ? value : undefined;
        }),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((value) => {
        if (this.onChange) {
          value ? this.onChange(value.id) : this.onChange(undefined);
        }
      });
  }

  async writeValue(value: string): Promise<void> {
    const label = await firstValueFrom(this.labelService.getLabelById(value));
    this.control.setValue(label ?? value);
  }

  registerOnChange(fn: (labelId?: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // eslint-disable-next-line
  displayFn(label: any) {
    return (label as Label)?.title ?? label;
  }
}
