import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('cw-book-reference')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BookReferenceElement extends LitElement {
  // I have not found a way to import the CSS and let the bundler do the work.
  // So instead, I just copied the highlight vs code style.
  static override styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
  }

  @state()
  book: any;

  @property({ attribute: 'isbn-13' })
  isbn13 = '';

  @property({ attribute: 'start-page' })
  startPage: string | undefined;

  @property({ attribute: 'end-page' })
  endPage: string | undefined;

  protected override update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    if (changedProperties.has('isbn13')) {
      fetch(`https://openlibrary.org/isbn/${this.isbn13}.json`)
        .then((x) => x.json())
        .then((res) => (this.book = res));
    }
  }

  override render() {
    if (!this.book) {
      return html`<div>Loading</div>`;
    }
    const pagesString =
      this.startPage === this.endPage
        ? `page ${this.startPage}`
        : `pages ${this.startPage} - ${this.endPage}`;
    return html` <div>${this.book.title}, ${pagesString}</div> `;
  }
}
