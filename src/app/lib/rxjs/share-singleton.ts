import { Observable, shareReplay } from 'rxjs';

/**
 * Shares the last replay of a **singleton** observable.
 *
 * Use this method when you want to use shareReplay in a such a way
 * that the observable is never closed. This is usually the case
 * when the observable is a singleton. The fact that it never closes
 * means that every new subscriber can be sure that he will
 * be provided with values. However, an observable should only
 * be forever-running when you are sure that it is a singleton
 * because otherwise you might create a memory leak. When you
 * create forever-running observables, those observables will
 * also stay in-memory forever and there you have a memory leak.
 */
export const shareSingleton =
  <T>(): ((source: Observable<T>) => Observable<T>) =>
  (source: Observable<T>): Observable<T> =>
    source.pipe(shareReplay({ bufferSize: 1, refCount: false }));
