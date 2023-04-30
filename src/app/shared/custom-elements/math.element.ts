import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import katex from 'katex';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import * as _ from 'lodash';

@customElement('cw-math')
export class MathElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-size: 1.5rem;
    }
  `;

  constructor() {
    super();
  }

  override render() {
    try {
      const renderedMath = katex.renderToString(_.unescape(this.innerHTML), {
        macros: {
          '\\f': '#1f(#2)',
        },
        displayMode: true,
      });
      return html` <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.css"
          integrity="sha384-ko6T2DjISesD0S+wOIeHKMyKsHvWpdQ1s/aiaQMbL+TIXx3jg6uyf9hlv3WWfwYv"
          crossorigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"
          integrity="sha384-PwRUT/YqbnEjkZO0zZxNqcxACrXe+j766U2amXcgMg5457rve2Y7I6ZJSm2A0mS4"
          crossorigin="anonymous"
        ></script>
        ${unsafeHTML(renderedMath)}`;
    } catch (e) {
      console.error(e);
      return html`<div>${e}</div>`;
    }
  }
}
