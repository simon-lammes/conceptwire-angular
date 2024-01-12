import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TreeDragDropService, TreeNode } from "primeng/api";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { find } from "unist-util-find";
import * as hast from "hast";
import { TreeModule, TreeNodeDropEvent } from "primeng/tree";
import { HtmlEditorNodeComponent } from "./html-editor-node/html-editor-node.component";

@Component({
  selector: "app-html-editor",
  standalone: true,
  imports: [TreeModule, HtmlEditorNodeComponent],
  template: `
    <p-tree
      class="md:w-30rem w-full"
      [value]="treeNodes"
      [draggableNodes]="true"
      [droppableNodes]="true"
      draggableScope="self"
      droppableScope="self"
      [validateDrop]="true"
      (onNodeDrop)="onNodeDrop($event)"
    >
      <ng-template let-node pTemplate="default">
        <app-html-editor-node [node]="node" />
      </ng-template>
    </p-tree>
  `,
  providers: [TreeDragDropService],
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlEditorComponent {
  treeNodes!: TreeNode<hast.Node>[];

  readonly customNames = new Map([
    ["cw-question-answer-exercise", "Question Answer Exercise"],
  ]);

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
    return node.type === "text";
  }

  hastNodeToVisualNode(node: hast.Node): TreeNode {
    return {
      label: this.getLabelForHastNode(node),
      children: (node as hast.Element).children
        ?.filter((node) => !this.shouldSkipHastNode(node))
        .map((child) => this.hastNodeToVisualNode(child)),
      data: node,
    };
  }

  private getLabelForHastNode(node: hast.Node) {
    if (node.type === "element") {
      return (
        this.customNames.get((node as hast.Element).tagName) ||
        (node as hast.Element).tagName
      );
    }
    return node.type;
  }

  onNodeDrop(event: TreeNodeDropEvent) {
    const accept = Math.random() < 0.5;
    console.log("random accept: ", accept);
    if (accept) {
      event.accept!();
    }
  }
}
