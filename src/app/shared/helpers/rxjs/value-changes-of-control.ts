import { FormControl } from '@angular/forms';
import { defer, shareReplay, startWith } from 'rxjs';

/**
 * Creates a hot observable that reflects the current value of a form control.
 *
 * @param control
 */
export const valueChangesOfControl = <T>(control: FormControl<T>) =>
  defer(() =>
    control.valueChanges.pipe(
      startWith(control.value),
      shareReplay({ bufferSize: 1, refCount: true }),
    ),
  );
