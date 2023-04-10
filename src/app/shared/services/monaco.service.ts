import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  readonly monaco = (window as any).monaco; // eslint-disable-line
}
