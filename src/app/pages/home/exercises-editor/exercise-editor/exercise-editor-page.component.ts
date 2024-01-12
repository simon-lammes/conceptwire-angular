import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HtmlEditorComponent } from "../../../../components/html-editor/html-editor.component";

@Component({
  selector: "app-html-editor-page",
  standalone: true,
  imports: [HtmlEditorComponent],
  template: `<app-html-editor />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseEditorPage {}
