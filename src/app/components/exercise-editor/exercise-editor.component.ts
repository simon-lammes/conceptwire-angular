import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TreeDragDropService, TreeNode } from "primeng/api";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { find } from "unist-util-find";
import * as hast from "hast";
import { TreeModule } from "primeng/tree";
import { EditorNodeComponent } from "./editor-node/editor-node.component";

@Component({
  selector: "app-exercise-editor",
  standalone: true,
  imports: [TreeModule, EditorNodeComponent],
  template: `
    <p-tree
      class="md:w-30rem w-full"
      [value]="treeNodes"
      [draggableNodes]="true"
      [droppableNodes]="true"
      draggableScope="self"
      droppableScope="self"
    >
      <ng-template let-node pTemplate="default">
        <app-editor-node [node]="node" />
      </ng-template>
    </p-tree>
  `,
  providers: [TreeDragDropService],
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseEditorComponent {
  treeNodes!: TreeNode<hast.Node>[];

  readonly x = `<cw-question-answer-exercise>
      <div slot="question">question???</div>
      <div slot="answer">answer!!!</div>
    </cw-question-answer-exercise>`;

  readonly y = fromHtmlIsomorphic(this.x);

  constructor() {
    const body: hast.Element | undefined = find(
      this.y,
      (node) => (node as hast.Element)?.tagName === "body",
    );
    console.log(body);
    this.treeNodes =
      body?.children
        .filter((node) => !this.shouldSkipHastNode(node))
        .map((node) => this.hastNodeToVisualNode(node)) ?? [];
  }

  shouldSkipHastNode(node: hast.Node): boolean {
    return node.type === "text" && !(node as hast.Text).value.trim();
  }

  hastNodeToVisualNode(node: hast.Node): TreeNode {
    return {
      label:
        node.type == "element" ? (node as hast.Element).tagName : node.type,
      children: (node as hast.Element).children
        ?.filter((node) => !this.shouldSkipHastNode(node))
        .map((child) => this.hastNodeToVisualNode(child)),
      data: node,
    };
  }
}
