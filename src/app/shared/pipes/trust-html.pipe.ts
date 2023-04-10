import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'trustHtml',
  standalone: true,
})
export class TrustHtmlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(value?: string | null): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(value ?? '');
  }
}
