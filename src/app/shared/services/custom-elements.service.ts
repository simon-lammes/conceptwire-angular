import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs';
import { CustomElementDeclaration, Package } from 'custom-elements-manifest';

@Injectable({
  providedIn: 'root',
})
export class CustomElementsService {
  readonly customElements$ = this.http
    .get('./assets/custom-elements.json')
    .pipe(
      map(
        (x) =>
          (x as Package).modules
            .flatMap((x) => x.declarations)
            .filter((x) => !!x) as CustomElementDeclaration[],
      ),
      shareReplay(1),
    );

  constructor(private http: HttpClient) {}

  getCustomElementByTagName(customElementTagName: string | undefined) {
    return this.customElements$.pipe(
      map((customElements) =>
        customElements.find((x) => x.tagName === customElementTagName),
      ),
    );
  }
}
