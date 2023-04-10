import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textContentOfHtml',
  standalone: true,
})
export class TextContentOfHtmlPipe implements PipeTransform {
  transform(trustedHtml: string): string {
    const span = document.createElement('span');
    span.innerHTML = trustedHtml;
    return span.textContent || span.innerText;
  }
}
