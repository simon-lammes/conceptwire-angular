import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-folder-input",
  standalone: true,
  imports: [ButtonModule],
  template: `
    <p-button
      [label]="value()?.name ?? 'Select Folder'"
      [rounded]="true"
      (onClick)="selectFolder()"
    ></p-button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FolderInputComponent,
    },
  ],
})
export class FolderInputComponent implements ControlValueAccessor {
  value = signal<FileSystemDirectoryHandle | null>(null);

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

  async selectFolder() {
    const directoryHandle = await showDirectoryPicker({
      mode: "readwrite",
    });
    if (this.onChangeCb) {
      this.onChangeCb(directoryHandle);
    }
    this.value.set(directoryHandle);
  }
}
