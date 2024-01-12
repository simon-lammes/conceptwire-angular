import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ExerciseEditorComponent } from "../../../../components/exercise-editor/exercise-editor.component";

@Component({
  selector: "app-exercise-editor-page",
  standalone: true,
  imports: [ExerciseEditorComponent],
  template: `<app-exercise-editor />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseEditorPage {}
