import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, shareReplay } from 'rxjs';
// @ts-ignore
import * as Handlebars from 'handlebars/dist/Handlebars.js';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  readonly loadAndCompileTemplate = (location: string) =>
    this.http.get(location, { responseType: 'text' }).pipe(
      map((template) => Handlebars.compile(template)),
      shareReplay()
    );

  readonly exerciseTemplate$ = this.loadAndCompileTemplate(
    './assets/templates/new-exercise.hbs'
  );

  readonly newLabelTemplate$ = this.loadAndCompileTemplate(
    './assets/templates/new-label.hbs'
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
}
