import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ExerciseFeedback } from '../models/exercise-feedback';

import install from '@twind/with-web-components';
// @ts-ignore
import config from '../../../twind.config.js';

const withTwind = install(config);

@customElement('cw-solution-feedback')
@install(config)
export class SolutionFeedbackElement extends withTwind(LitElement) {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
  }

  @property()
  isAnswerShown = false;

  @property()
  feedback?: ExerciseFeedback;

  @property({
    attribute: 'cw-immediately-jump-to-next-exercise-after-giving-feedback',
    type: Boolean,
  })
  immediatelyJumpToNextExerciseAfterGivingFeedback = false;

  private showAnswer() {
    this.isAnswerShown = true;
    const event = new CustomEvent<ExerciseFeedback>('cw-show-solution', {});
    this.dispatchEvent(event);
  }

  private onSuccess() {
    this.dispatchFeedback('success');
  }

  private onFailure() {
    this.dispatchFeedback('failure');
  }

  private dispatchFeedback(feedback: ExerciseFeedback) {
    this.feedback = feedback;
    const event = new CustomEvent<ExerciseFeedback>('cw-exercise-feedback', {
      detail: feedback,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
    if (this.immediatelyJumpToNextExerciseAfterGivingFeedback) {
      const event = new CustomEvent('cw-request-next-exercise', {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  override render() {
    return html` <cw-shoelace-context>
      ${this.isAnswerShown
        ? html`
            <div class="flex flex-row gap-8 pt-4">
              <sl-button
                variant="${this.feedback === 'failure' ? 'danger' : 'default'}"
                size="large"
                aria-label="Failed Exercise"
                ?disabled="${!!this.feedback}"
                @click="${this.onFailure}"
                circle
              >
                <sl-icon
                  name="hand-thumbs-down"
                  label="Failed Exercise"
                ></sl-icon>
              </sl-button>
              <sl-button
                variant="${this.feedback === 'success' ? 'success' : 'default'}"
                size="large"
                aria-label="Succeeded at Exercise"
                ?disabled="${!!this.feedback}"
                @click="${this.onSuccess}"
                circle
              >
                <sl-icon
                  name="hand-thumbs-up"
                  label="Succeeded at Exercise"
                ></sl-icon>
              </sl-button>
              ${!this.immediatelyJumpToNextExerciseAfterGivingFeedback &&
              this.feedback
                ? html`<cw-request-next-exercise-button></cw-request-next-exercise-button>`
                : ''}
            </div>
          `
        : html`
            <button
              @click="${this.showAnswer}"
              class="rounded-lg border-2 border-blue-200 bg-blue-50 px-3 py-2 text-blue-800 hover:bg-blue-100 focus:rounded-2xl focus:border-blue-800"
            >
              show solution
            </button>
          `}
    </cw-shoelace-context>`;
  }
}
