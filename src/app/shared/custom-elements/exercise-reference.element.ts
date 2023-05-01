import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Exercise } from '../models/exercise';

@customElement('cw-exercise-reference')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ExerciseReferenceElement extends LitElement {
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

  @property({ attribute: 'exercise-id' })
  exerciseId: string | undefined;

  @property({ type: Object })
  exercise: Exercise | undefined;

  private onClick() {
    const event = new CustomEvent<Exercise>('cw-open-exercise', {
      detail: this.exercise,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  override render() {
    if (!this.exercise) {
      return html`<div>The references exercise was not loaded.</div>`;
    }
    return html`
      <button style="display: block" @click="${this.onClick}">
        <div style="font-size: 1.125rem;">${this.exercise.title}</div>
        <div>${this.innerHTML}</div>
      </button>
    `;
  }
}
