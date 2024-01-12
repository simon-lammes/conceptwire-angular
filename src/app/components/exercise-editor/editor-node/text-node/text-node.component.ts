import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TreeNode } from "primeng/api";
import * as hast from "hast";
import { FormsModule } from "@angular/forms";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "app-text-node",
  standalone: true,
  imports: [FormsModule, InputTextareaModule],
  template: `<textarea
    rows="5"
    cols="30"
    pInputTextarea
    [ngModel]="node.data?.value"
  ></textarea>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextNodeComponent {
  @Input({ required: true })
  node!: TreeNode<hast.Text>;
}
