import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  template: ` <label
      [for]="id"
      class="block text-sm font-medium leading-6 text-gray-900"
      >{{ label }}</label
    >
    <div class="mt-2">
      <input
        [type]="inputType"
        [id]="id"
        [value]="value"
        (input)="onChange($event)"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        [placeholder]="placeholder ?? ''"
      />
    </div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input({ required: true })
  id!: string;

  @Input({ required: true })
  label!: string;

  @Input()
  placeholder?: string;

  @Input({ required: true })
  inputType!: string;

  value = '';

  onChangeCallback?: (value: string) => void;

  onTouched?: () => void;

  disabled = false;

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event: Event) {
    if (this.onChangeCallback)
      this.onChangeCallback((event.target as HTMLInputElement).value);
  }
}
