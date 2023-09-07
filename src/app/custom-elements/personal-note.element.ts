import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cw-personal-note')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PersonalNoteElement extends LitElement {
  // I have not found a way to import the CSS and let the bundler do the work.
  // So instead, I just copied the highlight vs code style.
  static override styles = css`
    :host {
      display: block;
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
    }
  `;

  constructor() {
    super();
  }

  override render() {
    return html`
      <cw-shoelace-context>
        <sl-details summary="Personal Note" class="custom-icons">
          <sl-icon name="info-circle" slot="expand-icon"></sl-icon>
          <sl-icon name="chevron-right" slot="collapse-icon"></sl-icon>
          <slot></slot>
        </sl-details>
      </cw-shoelace-context>
    `;
  }
}
