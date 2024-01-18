import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as hast from "hast";
import { QuestionAnswerExerciseComponent } from "./question-answer-exercise/question-answer-exercise.component";
import { DivComponent } from "./div/div.component";

@Component({
  selector: "app-node",
  standalone: true,
  imports: [QuestionAnswerExerciseComponent, DivComponent],
  template: `
    @switch (tagName) {
      @case ("cw-question-answer-exercise") {
        <app-question-answer-exercise [node]="$any(node)" />
      }
      @case ("div") {
        <app-div [node]="$any(node)" />
      }
    }
    @if (text) {
      {{ text }}
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements OnChanges {
  @Input({ required: true })
  node!: hast.Node;

  tagName?: string;

  text?: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.tagName = (this.node as hast.Element).tagName;
    this.text =
      this.node.type === "text"
        ? (this.node as hast.Text).value.trim()
        : undefined;
  }
}
