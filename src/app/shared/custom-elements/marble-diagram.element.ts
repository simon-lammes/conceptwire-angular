import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as d3 from 'd3';
import * as _ from 'lodash-es';

/**
 * A marble diagram known from RxJS or other ReactiveX implementations.
 */
@customElement('cw-marble-diagram')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MarbleDiagramElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: 'cw-source' })
  source = '-a--(bx)-|';

  @state()
  private _commands: string[] = [];

  @state()
  private _width: number = this.offsetWidth;

  private resizeObserver?: ResizeObserver;

  constructor() {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(
      _.debounce(() => (this._width = this.offsetWidth), 300)
    );
    this.resizeObserver.observe(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.unobserve(this);
  }

  override attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ) {
    super.attributeChangedCallback(name, _old, value);
    this._commands = [...this.source.matchAll(/(\(\S*\))|\S/g)].map(
      (x) => x[0]
    );
  }

  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    // This seems to be the right place to draw the svg with the help of lit.
    // We want lit to build the raw HTML without any of that fine d3 SVG stuff.
    // And immediately after that foundation has been rendered, we start drawing with d3.
    this.drawSvg();
  }

  drawSvg() {
    const svg = d3.select(this.renderRoot.querySelector('svg'));
    svg
      .attr('width', this.offsetWidth)
      .attr('height', 300)
      // This is the easiest way to update the svg: Clear everything and draw everything anew.
      .html('');
    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', 20)
      .attr('x2', this.offsetWidth - 5)
      .attr('y2', 20)
      .attr('stroke-width', 2)
      .attr('stroke', 'gray');
    svg
      .append('polygon')
      .attr('fill', 'gray')
      .attr(
        'points',
        `${this.offsetWidth},${20} ${this.offsetWidth - 8},${14} ${
          this.offsetWidth - 8
        },${26}`
      );

    const scalePoint = d3
      .scalePoint()
      .domain(this._commands.map((value, index) => '' + index))
      .range([0, this.offsetWidth])
      .padding(0.5)
      .round(true);
    for (const index of scalePoint.domain()) {
      const command = this._commands[+index];
      if (command === '-') continue;
      svg
        .append('circle')
        .attr('r', 19)
        .attr('fill', 'rgb(235, 173, 213)')
        .attr('stroke', 'gray')
        .attr('stroke-width', 2)
        .attr('cy', 20)
        .attr('cx', scalePoint(index)!);
      svg
        .append('text')
        .attr('font-size', 18)
        .attr('alignment-baseline', 'middle')
        .attr('x', scalePoint(index)!)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .text(command);
    }
  }

  override render() {
    return html`<svg></svg>`;
  }
}
