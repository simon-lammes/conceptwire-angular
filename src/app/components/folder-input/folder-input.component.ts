import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";

export type DirectoryValidator = (
  directory: FileSystemDirectoryHandle,
) => Promise<RejectionDescription | null | undefined>;

export interface RejectionDescription {
  rejectionMessage: string;
}

@Component({
  selector: "app-folder-input",
  standalone: true,
  imports: [ButtonModule, DialogModule],
  template: `
    <label class="block pb-2">{{ label }}</label>
    <p-button
      [label]="value()?.name ?? 'Select Folder'"
      [rounded]="true"
      (onClick)="selectFolder()"
      icon="pi pi-folder"
    ></p-button>
    <p-dialog
      header="Folder not Accepted"
      [style]="{ width: '50vw' }"
      [visible]="!!displayedRejection()"
      [draggable]="false"
      (visibleChange)="onVisibilityChange($event)"
    >
      <div>{{ displayedRejection()?.rejectionMessage }}</div>
    </p-dialog>
  `,
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
  @Input()
  label = "";

  @Input()
  errors?: any;

  @Input()
  folderValidator?: DirectoryValidator;

  readonly displayedRejection = signal<RejectionDescription | undefined>(
    undefined,
  );

  value = signal<FileSystemDirectoryHandle | null>(null);

  onChangeCb?: (value: any) => void;

  onTouchedCb?: () => void;

  writeValue(obj: any): void {
    this.value.set(obj);
    this.displayedRejection.set(undefined);
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
    if (this.folderValidator) {
      const validationResult = await this.folderValidator(directoryHandle);
      if (validationResult) {
        this.displayedRejection.set(validationResult);
        return;
      }
    }
    if (this.onChangeCb) {
      this.onChangeCb(directoryHandle);
    }
    this.value.set(directoryHandle);
  }

  onVisibilityChange(visible: boolean) {
    if (!visible) this.displayedRejection.set(undefined);
  }
}
