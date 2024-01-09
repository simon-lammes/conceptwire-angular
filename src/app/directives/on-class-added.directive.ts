import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appObserveClassName]',
  standalone: true,
})
export class ObserveClassNameDirective {
  /**
   * The class name that we want to observe so that we know when it is being added.
   */
  @Input('appObserveClassName')
  observedClassName = '';

  @Output()
  classNameAdded = new EventEmitter();

  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  ngOnInit() {
    const observer = new MutationObserver((event) => {
      if (
        this.elementRef.nativeElement.classList.contains(this.observedClassName)
      ) {
        this.classNameAdded.emit();
      }
    });
    observer.observe(this.elementRef.nativeElement, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });
  }
}
