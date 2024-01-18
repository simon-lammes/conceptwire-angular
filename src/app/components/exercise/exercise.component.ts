import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { find } from "unist-util-find";
import * as hast from "hast";
import { NodeComponent } from "./node/node.component";

@Component({
  selector: "app-exercise",
  standalone: true,
  imports: [NodeComponent],
  template: `
    @if (body) {
      @for (x of body.children; track $index) {
        <app-node [node]="x" />
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseComponent implements OnChanges {
  @Input()
  exerciseContent!: string;

  body: hast.Element | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    const root = fromHtmlIsomorphic(this.exerciseContent);
    this.body = find(root, (node) => {
      return (
        node.type === "element" && (node as hast.Element).tagName === "body"
      );
    });
  }
}
