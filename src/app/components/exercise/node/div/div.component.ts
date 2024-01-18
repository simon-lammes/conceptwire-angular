import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
} from "@angular/core";
import * as hast from "hast";
import { NodeComponent } from "../node.component";

@Component({
  selector: "app-div",
  standalone: true,
  imports: [forwardRef(() => NodeComponent)],
  template: `
    @for (child of node.children; track $index) {
      <app-node [node]="child" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DivComponent {
  @Input({ required: true })
  node!: hast.Element;
}
