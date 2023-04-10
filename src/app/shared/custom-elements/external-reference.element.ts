import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cw-external-reference')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CodeElement extends LitElement {
  static override styles = css``;

  @property({ attribute: 'cw-href' })
  href?: string;

  constructor() {
    super();
  }

  override render() {
    return html`<a href="${this.href}" target="_blank"><slot></slot></a>`;
  }
}
