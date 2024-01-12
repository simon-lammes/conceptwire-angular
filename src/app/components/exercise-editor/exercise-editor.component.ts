import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TreeNode } from "primeng/api";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";

@Component({
  selector: "app-exercise-editor",
  standalone: true,
  imports: [],
  template: ` <p>exercise-editor works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseEditorComponent {
  treeNodes!: TreeNode[];

  readonly x = `<cw-question-answer-exercise>
      <div slot="question">question???</div>
      <div slot="answer">answer!!!</div>
    </cw-question-answer-exercise>`;

  readonly y = fromHtmlIsomorphic(this.x);

  constructor() {
    console.log(this.y);
  }
}
