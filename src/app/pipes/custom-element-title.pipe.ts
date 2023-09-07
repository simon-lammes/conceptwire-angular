import { Pipe, PipeTransform } from '@angular/core';
import { CustomElementDeclaration } from 'custom-elements-manifest';
import * as _ from 'lodash';

@Pipe({
  name: 'customElementTitle',
  standalone: true,
})
export class CustomElementTitlePipe implements PipeTransform {
  transform(customElementDeclaration: CustomElementDeclaration): string {
    const nameInStartCase = _.startCase(customElementDeclaration.name);
    return nameInStartCase.endsWith(' Element')
      ? nameInStartCase.slice(0, nameInStartCase.length - 8)
      : nameInStartCase;
  }
}
