import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Exercise } from '../models/exercise';

import install from '@twind/with-web-components';
// @ts-ignore
import config from '../../../twind.config.js';

const withTwind = install(config);

@customElement('cw-exercise-reference')
@install(config)
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
      <button
        class="rounded-lg border-2 border-blue-500 bg-blue-50 px-3 py-2 text-blue-800 hover:bg-blue-100 focus:rounded-2xl focus:border-blue-900"
        @click="${this.onClick}"
      >
        <div class="text-lg">${this.exercise.title}</div>
        <div>${this.innerHTML}</div>
      </button>
    `;
  }
}
