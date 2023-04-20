import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cw-youtube-video')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class YoutubeVideoElement extends LitElement {
  // I have not found a way to import the CSS and let the bundler do the work.
  // So instead, I just copied the highlight vs code style.
  static override styles = css`
    :host {
      display: block;
      max-width: 400px;
      margin-top: 1rem;
    }
  `;

  constructor() {
    super();
  }

  @property()
  videoId: string | undefined;

  override render() {
    const url = 'https://www.youtube.com/embed/' + this.id;
    return html`
      <iframe
        style="max-width: 100%"
        width="100%"
        height="100%"
        src="${url}"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  }
}
