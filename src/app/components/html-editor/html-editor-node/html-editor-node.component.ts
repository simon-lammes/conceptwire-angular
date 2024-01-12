import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import * as hast from "hast";
import { TreeNode } from "primeng/api";
import { HtmlEditorTextNodeComponent } from "./html-editor-text-node/html-editor-text-node.component";
import { TagModule } from "primeng/tag";

@Component({
  selector: "app-html-editor-node",
  standalone: true,
  imports: [HtmlEditorTextNodeComponent, TagModule],
  template: `
    @if (isTextNode()) {
      <app-html-editor-text-node [node]="$any(node)" />
    } @else {
      @if (getSlotName(); as slot) {
        <p-tag severity="primary" [value]="slot"></p-tag>
      }
      {{ node.label }}
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlEditorNodeComponent {
  @Input({ required: true })
  node!: TreeNode<hast.Node>;

  isTextNode() {
    return this.node.data?.type === "text";
  }

  getSlotName() {
    return (this.node.data as hast.Element).properties?.["slot"] as string;
  }
}
