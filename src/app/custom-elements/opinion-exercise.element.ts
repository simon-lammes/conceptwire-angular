import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cw-opinion-exercise')
export class OpinionExerciseElement extends LitElement {
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

  @property({
    attribute: 'cw-immediately-jump-to-next-exercise-after-giving-feedback',
    type: Boolean,
  })
  immediatelyJumpToNextExerciseAfterGivingFeedback = false;

  override render() {
    return html`
      <slot name="question"></slot>
      ${this.isAnswerShown
        ? html`
            <hr />
            <slot></slot>
          `
        : ''}
      <cw-solution-feedback
        @cw-show-solution="${() => {
          this.isAnswerShown = true;
        }}"
        ?cw-immediately-jump-to-next-exercise-after-giving-feedback="${this
          .immediatelyJumpToNextExerciseAfterGivingFeedback}"
      ></cw-solution-feedback>
    `;
  }
}
