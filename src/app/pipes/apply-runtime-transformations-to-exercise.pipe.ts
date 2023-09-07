import { Pipe, PipeTransform } from '@angular/core';
import { StudySettingsService } from '../services/study-settings.service';
import { firstValueFrom } from 'rxjs';
import { ExerciseService } from '../services/exercise.service';
import { DbService } from '../services/db.service';

@Pipe({
  name: 'applyRuntimeTransformationsToExercise',
  standalone: true,
})
export class ApplyRuntimeTransformationsToExercisePipe
  implements PipeTransform
{
  constructor(
    private studySettingsService: StudySettingsService,
    private exerciseService: ExerciseService,
    private db: DbService,
  ) {}

  /**
   * Before displaying an exercise, we might want to transform/adjust it a bit to enhance the user experience.
   * For example, we might want to edit the html in accordance to the user's preferences.
   * Those changes should not be persisted in the exercise, but rather performed on demand whenever the exercise is
   * being displayed in a certain context.
   *
   * @param exerciseContent
   */
  async transform(exerciseContent: string): Promise<string> {
    const exerciseContainer = document.createElement('span');
    exerciseContainer.innerHTML = exerciseContent;
    this.writeCodeContentIntoAttribute(exerciseContainer, exerciseContent);
    await this.applySettings(exerciseContainer);
    await this.loadExerciseReferences(exerciseContainer);
    await this.loadBookReferences(exerciseContainer);
    return exerciseContainer.innerHTML;
  }

  /**
   * The user's study settings change behavior of exercises. To achieve that the exercises' html
   * is modified, for example by setting attributes.
   *
   * Those modifications should not be persisted, but only performed to the in-memory exercise that
   * is being displayed to the user.
   */
  private async applySettings(exerciseContainer: HTMLSpanElement) {
    const studySettings = await firstValueFrom(
      this.studySettingsService.studySettings$,
    );
    this.applySettingImmediatelyJumpToNextExerciseAfterGivingFeedback(
      exerciseContainer,
      studySettings?.immediatelyJumpToNextExerciseAfterGivingFeedback ?? false,
    );
  }

  private applySettingImmediatelyJumpToNextExerciseAfterGivingFeedback(
    exerciseContainer: HTMLSpanElement,
    immediatelyJumpToNextExerciseAfterGivingFeedback: boolean,
  ) {
    if (!immediatelyJumpToNextExerciseAfterGivingFeedback) return;
    const affectedElements = exerciseContainer.querySelectorAll(
      'cw-svg-occlusion-exercise, cw-question-answer-exercise, cw-opinion-exercise',
    );
    affectedElements.forEach((element) =>
      element.setAttribute(
        'cw-immediately-jump-to-next-exercise-after-giving-feedback',
        '',
      ),
    );
  }

  /**
   * Having the innerHtml as an attribute string has the advantage that it stays exactly as it originally was.
   * Currently, this only matters for HTML code that uses attribute names with uppercase names like "*ngFor" or "(personAdded)="addPerson($event)".
   * Once we put code like this into the DOM, the browser makes those attributes lowercase which is perfectly fine behavior.
   * However, for our visualization, we want to keep the upper case letters. Therefore, the surrounding application
   * needs to read the inner HTML before it is put into the dom and then write it into this attribute where the uppercase characters are safe.
   *
   * @param exerciseContainer
   * @param originalHtmlString
   * @private
   */
  private writeCodeContentIntoAttribute(
    exerciseContainer: HTMLSpanElement,
    originalHtmlString: string,
  ) {
    const codeElements = exerciseContainer.querySelectorAll('cw-code');
    codeElements.forEach((codeElement) => {
      const id = codeElement.id;
      const indexOfId = originalHtmlString.indexOf(`id="${id}"`);
      if (!indexOfId) return;
      const indexOfLastCharacterOfOpeningTag = originalHtmlString.indexOf(
        '>',
        indexOfId,
      );
      const indexOfBeginningOfInnerHtml = indexOfLastCharacterOfOpeningTag + 1;
      const indexOfClosingTag = originalHtmlString.indexOf(
        '</cw-code>',
        indexOfBeginningOfInnerHtml,
      );
      codeElement.setAttribute(
        'cw-inner-html-as-attribute',
        originalHtmlString.slice(
          indexOfBeginningOfInnerHtml,
          indexOfClosingTag,
        ),
      );
    });
  }

  private async loadExerciseReferences(exerciseContainer: HTMLSpanElement) {
    const exerciseReferenceElements = Array.from(
      exerciseContainer.querySelectorAll('cw-exercise-reference'),
    );
    const exerciseIds = exerciseReferenceElements
      .map((x) => x.getAttribute('exercise-id'))
      .filter((x) => !!x) as string[];
    const exercises = await firstValueFrom(
      this.exerciseService.getExercisesByIds(exerciseIds),
    );
    exerciseReferenceElements.forEach((el) => {
      const referencedExerciseId = el.getAttribute('exercise-id');
      const referencedExercise = exercises.find(
        (x) => x.id === referencedExerciseId,
      );
      if (referencedExercise) {
        el.setAttribute('exercise', JSON.stringify(referencedExercise));
      }
    });
  }

  private async loadBookReferences(exerciseContent: HTMLSpanElement) {
    const bookReferences = Array.from(
      exerciseContent.querySelectorAll('cw-book-reference'),
    );
    for (const bookReference of bookReferences) {
      const isbn13 = bookReference.getAttribute('isbn-13');
      if (isbn13) {
        const book = await this.db.books.get(isbn13);
        if (book) {
          bookReference.setAttribute('book', JSON.stringify(book));
        }
      }
    }
  }
}
