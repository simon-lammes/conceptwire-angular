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
import { NodeComponent, NodeDefinition } from "./node/node.component";
import { QuestionAnswerExerciseComponent } from "./node/question-answer-exercise/question-answer-exercise.component";
import { DivComponent } from "./node/div/div.component";

@Component({
  selector: "app-exercise",
  standalone: true,
  imports: [NodeComponent],
  template: `
    @if (body) {
      @for (child of body.children; track $index) {
        <app-node [node]="child" [nodeDefinitions]="nodeDefinitions" />
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

  readonly nodeDefinitions: NodeDefinition[] = [
    {
      tagName: "cw-question-answer-exercise",
      component: QuestionAnswerExerciseComponent,
    },
    {
      tagName: "div",
      component: DivComponent,
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    const root = fromHtmlIsomorphic(this.exerciseContent);
    this.body = find(root, (node) => {
      return (
        node.type === "element" && (node as hast.Element).tagName === "body"
      );
    });
  }
}
