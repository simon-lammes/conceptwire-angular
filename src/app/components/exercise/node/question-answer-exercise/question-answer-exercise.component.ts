import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as hast from "hast";
import { find } from "unist-util-find";
import { NodeComponent, NodeDefinition } from "../node.component";

@Component({
  selector: "app-question-answer-exercise",
  standalone: true,
  imports: [forwardRef(() => NodeComponent)],
  template: ` @if (questionNode) {
    <div>
      Question:
      <app-node [node]="questionNode" [nodeDefinitions]="nodeDefinitions" />
    </div>
    <hr />
    @if (answerNode) {
      <div>
        Answer:
        <app-node [node]="answerNode" [nodeDefinitions]="nodeDefinitions" />
      </div>
    }
  }`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionAnswerExerciseComponent implements OnChanges {
  @Input({ required: true })
  node!: hast.Element;

  @Input({ required: true })
  nodeDefinitions!: NodeDefinition[];

  questionNode?: hast.Node;

  answerNode?: hast.Node;

  ngOnChanges(changes: SimpleChanges): void {
    this.questionNode = find(
      this.node,
      (x) =>
        x.type === "element" &&
        (x as hast.Element).properties?.["slot"] === "question",
    );
    this.answerNode = find(
      this.node,
      (x) =>
        x.type === "element" &&
        (x as hast.Element).properties?.["slot"] === "answer",
    );
  }
}
