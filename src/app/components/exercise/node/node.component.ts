import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
} from "@angular/core";
import * as hast from "hast";
import { QuestionAnswerExerciseComponent } from "./question-answer-exercise/question-answer-exercise.component";
import { DivComponent } from "./div/div.component";
import { NgComponentOutlet } from "@angular/common";

export interface NodeDefinition {
  component: Type<any>;
  tagName: string;
}

@Component({
  selector: "app-node",
  standalone: true,
  imports: [QuestionAnswerExerciseComponent, DivComponent, NgComponentOutlet],
  template: `
    @if (nodeDefinition) {
      <ng-container
        *ngComponentOutlet="
          nodeDefinition.component;
          inputs: { nodeDefinitions: nodeDefinitions, node: node }
        "
      />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements OnChanges {
  @Input({ required: true })
  node!: hast.Node;

  @Input({ required: true })
  nodeDefinitions?: NodeDefinition[];

  nodeDefinition?: NodeDefinition;

  ngOnChanges(changes: SimpleChanges): void {
    this.nodeDefinition = this.nodeDefinitions?.find(
      (x) => x.tagName === (this.node as hast.Element).tagName,
    );
  }
}
