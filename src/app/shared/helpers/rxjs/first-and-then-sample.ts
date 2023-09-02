import { first, merge, Observable, ObservableInput, sample, skip } from 'rxjs';

/**
 * Copies the behavior of RxJS sample with the difference that the first value of
 * the source observable is emitted directly - irrespective of the notifier/sample.
 */
export const firstAndThenSample: (
  notifier: ObservableInput<unknown>,
) => <T>(source: Observable<T>) => Observable<T> =
  (notifier: ObservableInput<unknown>) =>
  <T>(source: Observable<T>) =>
    merge(source.pipe(first()), source.pipe(skip(1), sample(notifier)));
