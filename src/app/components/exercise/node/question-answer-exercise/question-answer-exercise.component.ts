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
import { NodeComponent } from "../node.component";

@Component({
  selector: "app-question-answer-exercise",
  standalone: true,
  imports: [forwardRef(() => NodeComponent)],
  template: ` @if (questionNode) {
    <div>
      Question:
      <app-node [node]="questionNode" />
    </div>
    <hr />
    @if (answerNode) {
      <div>
        Answer:
        <app-node [node]="answerNode" />
      </div>
    }
  }`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionAnswerExerciseComponent implements OnChanges {
  @Input({ required: true })
  node!: hast.Element;

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
