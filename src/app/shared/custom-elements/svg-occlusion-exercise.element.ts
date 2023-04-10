import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('cw-svg-occlusion-exercise')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SvgOcclusionExerciseElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .occlusion-active .cw-occlusion-part {
      display: none;
    }
  `;

  _content = '';

  @property()
  _showSolution = false;

  @property({
    attribute: 'cw-immediately-jump-to-next-exercise-after-giving-feedback',
    type: Boolean,
  })
  immediatelyJumpToNextExerciseAfterGivingFeedback = false;

  constructor() {
    super();
    const el = document.createElement('div');
    el.innerHTML = this.innerHTML;
    this._content = el.querySelector('svg')?.outerHTML ?? '';
  }

  override render() {
    return html`
      <div class="${classMap({ 'occlusion-active': !this._showSolution })}">
        ${unsafeHTML(this._content)}
        ${this._showSolution ? html`<slot name="solution"></slot>` : ``}
        <cw-solution-feedback
          @cw-show-solution="${() => {
            this._showSolution = true;
          }}"
          ?cw-immediately-jump-to-next-exercise-after-giving-feedback="${this
            .immediatelyJumpToNextExerciseAfterGivingFeedback}"
        ></cw-solution-feedback>
      </div>
    `;
  }
}
