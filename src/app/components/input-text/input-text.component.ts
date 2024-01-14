import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-input-text",
  standalone: true,
  imports: [FormsModule, InputTextModule, ReactiveFormsModule, NgClass],
  template: `
    <div class="flex flex-col">
      @if (name) {
        <label
          class="pb-2"
          [for]="id"
          [ngClass]="{ 'p-error': !!errorMessage }"
          >{{ name }}</label
        >
      }
      <input
        [id]="id"
        [type]="type"
        [value]="value()"
        pInputText
        [placeholder]="placeholder"
        (input)="onChange($event)"
        (blur)="onBlur()"
        [ngClass]="{
          'ng-invalid ng-dirty': !!errorMessage
        }"
      />
      <small class="p-error pt-1 text-xs">
        <span
          [ngClass]="{
            'inline-block before:content-[]': reserveSpaceForErrorMessage
          }"
          >{{ errorMessage }}</span
        >
      </small>
    </div>
  `,
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
      useExisting: InputTextComponent,
    },
  ],
})
export class InputTextComponent implements ControlValueAccessor {
  @Input()
  name = "";

  @Input()
  type = "text";

  @Input()
  errorMessage = "";

  /**
   * If set to true, the component will reserve some empty space for an error message.
   * This has the advantage that there will be no layout shift once an error message appears.
   * It has the disadvantage that the space might not be needed at all.
   */
  @Input()
  reserveSpaceForErrorMessage = true;

  @Input()
  placeholder = "";

  readonly id = crypto.randomUUID();

  value = signal("");

  onChangeCb?: (value: any) => void;

  onTouchedCb?: () => void;

  writeValue(obj: any): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.onChangeCb) {
      this.onChangeCb(value);
    }
    this.value.set(value);
  }

  onBlur() {
    if (this.onTouchedCb) {
      this.onTouchedCb();
    }
  }
}
