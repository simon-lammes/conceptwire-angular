import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cw-instructions')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class InstructionsElement extends LitElement {
  // I have not found a way to import the CSS and let the bundler do the work.
  // So instead, I just copied the highlight vs code style.
  static override styles = css`
    :host {
      display: block;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    slot {
      font-weight: 500;
    }
  `;

  constructor() {
    super();
  }

  override render() {
    return html`<cw-shoelace-context>
      <sl-alert variant="neutral" open>
        <sl-icon slot="icon" name="list-task"></sl-icon>
        <slot></slot>
      </sl-alert>
    </cw-shoelace-context>`;
  }
}
