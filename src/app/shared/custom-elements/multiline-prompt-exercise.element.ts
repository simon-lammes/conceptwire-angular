import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ExerciseFeedback } from '../models/exercise-feedback';
import { classMap } from 'lit/directives/class-map.js';

@customElement('cw-multiline-prompt-exercise')
export class MultilinePromptExerciseExercise extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .textarea-success {
      background: rgba(144, 238, 144, 0.3);
    }

    .textarea-failure {
      background: rgba(205, 92, 92, 0.3);
    }
  `;

  constructor() {
    super();
  }

  @query('textarea')
  textarea!: HTMLTextAreaElement;

  @property({ attribute: 'cw-solution' })
  solution = '';

  @property()
  result?: {
    correct: boolean;
    solutionRows: string[];
    answerRows: string[];
  };

  private dispatchFeedback(feedback: ExerciseFeedback) {
    const event = new CustomEvent<ExerciseFeedback>('cw-exercise-feedback', {
      detail: feedback,
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  private checkAnswer() {
    const solutionRows = this.solution.split('\n').map((x) => x.trim());
    const answerRows = this.textarea.value.split('\n').map((x) => x.trim());
    const isCorrect =
      solutionRows.length === answerRows.length &&
      answerRows.every((value, index) => value === solutionRows[index]);
    this.dispatchFeedback(isCorrect ? 'success' : 'failure');
    this.result = {
      correct: isCorrect,
      answerRows,
      solutionRows,
    };
  }

  override render() {
    const solutionFragment = !this.result
      ? html`<button @click="${this.checkAnswer}">submit</button>`
      : this.result.correct
      ? html`<div style="font-size: 4rem; line-height: 1">✅</div>`
      : this.result.solutionRows.map((row) => html`<div>${row}</div>`);

    return html`
      <slot></slot>
      <div style="display: flex; flex-direction: row; gap: 1rem">
        <div style="flex-basis: 0; flex-grow: 1;">
          <div>Answer</div>
          <textarea
            rows="6"
            cols="50"
            ?disabled="${!!this.result}"
            class="${classMap({
              'textarea-success': this.result?.correct === true,
              'textarea-failure': this.result?.correct === false,
            })}"
            style="width: 100%"
          ></textarea>
        </div>
        <div style="flex-basis: 0; flex-grow: 1">
          <div>Solution</div>
          ${solutionFragment}
          ${this.result
            ? html`<cw-request-next-exercise-button></cw-request-next-exercise-button>`
            : ''}
        </div>
      </div>
    `;
  }
}
