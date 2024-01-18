import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
} from "@angular/core";
import * as hast from "hast";
import { NodeComponent, NodeDefinition } from "../node.component";

@Component({
  selector: "app-div",
  standalone: true,
  imports: [forwardRef(() => NodeComponent)],
  template: `
    @for (child of node.children; track $index) {
      <app-node [node]="child" [nodeDefinitions]="nodeDefinitions" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DivComponent {
  @Input({ required: true })
  node!: hast.Element;

  @Input({ required: true })
  nodeDefinitions!: NodeDefinition[];
}
