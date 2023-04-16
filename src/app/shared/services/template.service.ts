import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, shareReplay } from 'rxjs';
// @ts-ignore
import * as Handlebars from 'handlebars/dist/Handlebars.js';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  readonly exerciseTemplate$ = this.http
    .get('./assets/templates/new-exercise.hbs', { responseType: 'text' })
    .pipe(
      map((template) => Handlebars.compile(template)),
      shareReplay()
    );

  constructor(private http: HttpClient) {}

  async createNewExercise(args: { exerciseId: string }) {
    const template = await firstValueFrom(this.exerciseTemplate$);
    return template(args);
  }
}
