import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ExerciseFeedback } from '../models/exercise-feedback';

@customElement('cw-solution-feedback')
export class SolutionFeedbackElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    button {
      cursor: pointer;
    }

    .feedback-row {
      display: flex;
      flex-direction: row;
      gap: 4rem;
      padding-top: 1rem;
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
            <div class="feedback-row">
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
        : html` <button @click="${this.showAnswer}">show solution</button> `}
    </cw-shoelace-context>`;
  }
}
