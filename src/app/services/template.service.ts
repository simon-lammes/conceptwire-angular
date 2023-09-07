import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, shareReplay } from 'rxjs';
// @ts-ignore
import * as Handlebars from 'handlebars/dist/handlebars.js';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  readonly loadAndCompileTemplate = (location: string) =>
    this.http.get(location, { responseType: 'text' }).pipe(
      map((template) => Handlebars.compile(template)),
      shareReplay(),
    );

  readonly exerciseTemplate$ = this.loadAndCompileTemplate(
    './assets/templates/new-exercise.hbs',
  );

  readonly newLabelTemplate$ = this.loadAndCompileTemplate(
    './assets/templates/new-label.hbs',
  );

  readonly findMissingElementExerciseTemplate$ = this.loadAndCompileTemplate(
    './assets/templates/find-missing-element-exercise.hbs',
  );

  readonly keymapCommandExerciseTemplate$ = this.loadAndCompileTemplate(
    './assets/templates/keymap-command-exercise.hbs',
  );

  constructor(private http: HttpClient) {}

  async createNewExercise(args: { exerciseId: string }) {
    const template = await firstValueFrom(this.exerciseTemplate$);
    return template(args);
  }

  async createNewLabel(args: { labelId: string }) {
    const template = await firstValueFrom(this.newLabelTemplate$);
    return template(args);
  }

  async createFindMissingElementExercise(args: {
    concept: {
      id: string;
      setDescription: string;
      title: string;
      directLabelIds: string;
    };
    missingElement: { title: string; rawContent: string };
    existingElements: { rawContent: string }[];
  }) {
    const template = await firstValueFrom(
      this.findMissingElementExerciseTemplate$,
    );
    return template(args);
  }

  async createKeymapCommandExercise(args: {
    concept: {
      id: string;
      title: string;
      directLabelIds: string;
    };
    command: {
      operatingSystem: string;
      title: string;
      key: string;
    };
  }) {
    const template = await firstValueFrom(this.keymapCommandExerciseTemplate$);
    return template(args);
  }
}
