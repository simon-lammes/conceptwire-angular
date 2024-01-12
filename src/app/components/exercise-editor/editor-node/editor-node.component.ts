import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import * as hast from "hast";
import { TreeNode } from "primeng/api";
import { TextNodeComponent } from "./text-node/text-node.component";

@Component({
  selector: "app-editor-node",
  standalone: true,
  imports: [TextNodeComponent],
  template: `
    @if (isTextNode()) {
      <app-text-node [node]="$any(node)" />
    } @else {
      !!!<b>{{ node.label }}</b>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorNodeComponent {
  @Input({ required: true })
  node!: TreeNode<hast.Node>;

  isTextNode() {
    return this.node.data?.type === "text";
  }
}
