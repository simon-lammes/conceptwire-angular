import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import * as hast from "hast";
import { NodeDefinition } from "../node.component";

@Component({
  selector: "app-text",
  standalone: true,
  imports: [],
  template: ` {{ node.value }} `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  @Input({ required: true })
  node!: hast.Text;

  @Input({ required: true })
  nodeDefinitions!: NodeDefinition[];
}
