import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cw-element')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ElementElement extends LitElement {
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

  @property({ attribute: 'cw-title' })
  cwTitle: string | undefined;

  override render() {
    return html`
      <div style="font-size: 1.125rem; line-height: 1.75rem;  margin-top: 1rem">
        ${this.cwTitle}
      </div>
      <slot></slot>
    `;
  }
}
