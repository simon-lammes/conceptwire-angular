import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import hljs from 'highlight.js';

@customElement('cw-code')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CodeElement extends LitElement {
  // I have not found a way to import the CSS and let the bundler do the work.
  // So instead, I just copied the highlight vs code style.
  static override styles = css`
    :host {
      display: block;
      overflow-x: auto;
    }

    pre code.hljs {
      display: block;
      overflow-x: auto;
      padding: 1em;
    }
    code.hljs {
      padding: 3px 5px;
    }
    .hljs {
      background: #fff;
      color: #000;
    }
    .hljs-comment,
    .hljs-quote,
    .hljs-variable {
      color: green;
    }
    .hljs-built_in,
    .hljs-keyword,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-tag {
      color: #00f;
    }
    .hljs-addition,
    .hljs-attribute,
    .hljs-literal,
    .hljs-section,
    .hljs-string,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-title,
    .hljs-type {
      color: #a31515;
    }
    .hljs-deletion,
    .hljs-meta,
    .hljs-selector-attr,
    .hljs-selector-pseudo {
      color: #2b91af;
    }
    .hljs-doctag {
      color: grey;
    }
    .hljs-attr {
      color: red;
    }
    .hljs-bullet,
    .hljs-link,
    .hljs-symbol {
      color: #00b0e8;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  `;

  constructor() {
    super();
  }

  @property({ attribute: 'cw-language' })
  language = 'javascript';

  /**
   * The surrounding context/application can read the innerHtml and put the value in here.
   * Having the innerHtml as an attribute string has the advantage that it stays exactly as it originally was.
   * Currently, this only matters for HTML code that uses attribute names with uppercase names like "*ngFor" or "(personAdded)="addPerson($event)".
   * Once we put code like this into the DOM, the browser makes those attributes lowercase which is perfectly fine behavior.
   * However, for our visualization, we want to keep the upper case letters. Therefore, the surrounding application
   * needs to read the inner HTML before it is put into the dom and then write it into this attribute where the uppercase characters are safe.
   */
  @property({ attribute: 'cw-inner-html-as-attribute' })
  innerHtmlAsAttribute?: string;

  override render() {
    const highlightedHtml = hljs.highlight(
      this.innerHtmlAsAttribute ?? this.innerHTML,
      {
        language: this.language,
      },
    ).value;
    return html`<pre><code>${unsafeHTML(highlightedHtml)}</code></pre>`;
  }
}
