import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cw-request-next-exercise-button')
export class RequestNextExerciseButtonElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    button {
      cursor: pointer;
    }
  `;

  constructor() {
    super();
  }

  private requestNextExercise() {
    const event = new CustomEvent('cw-request-next-exercise', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  override render() {
    return html`
      <cw-shoelace-context>
        <sl-button
          variant="primary"
          size="large"
          aria-label="Request Next Exercise"
          @click="${this.requestNextExercise}"
          circle
        >
          <sl-icon name="arrow-right" label="Next Exercise"></sl-icon>
        </sl-button>
      </cw-shoelace-context>
    `;
  }
}
