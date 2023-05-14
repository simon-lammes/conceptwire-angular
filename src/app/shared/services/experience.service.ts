import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';
import { liveQuery } from 'dexie';
import {
  Experience,
  IndexForLabelStreakAndLastSeen,
} from '../models/experience';
import { ExerciseResult } from '../models/exerciseResult';
import { addMilliseconds, sub } from 'date-fns';
import { StudySettingsService } from './study-settings.service';
import { ExerciseCooldownService } from './exercise-cooldown.service';
import { StudyProgress } from '../models/study-progress';
import { StudySettings } from '../models/study-settings';
import { ExerciseService } from './exercise.service';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  constructor(
    private db: DbService,
    private studySettingsService: StudySettingsService,
    private exerciseCooldownService: ExerciseCooldownService,
    private exerciseService: ExerciseService
  ) {}

  async updateExperiencesTable() {
    await this.db.transaction(
      'rw',
      [this.db.experiences, this.db.exercises, this.db.exerciseLabels],
      async () => {
        await this.db.exercises.each(async (exercise) => {
          const [experience, exerciseLabels] = await Promise.all([
            this.db.experiences.get(exercise.id),
            this.db.exerciseLabels
              .where('exerciseId')
              .equals(exercise.id)
              .toArray(),
          ]);
          const streak = experience?.streak ?? 0;
          const lastSeen = experience?.lastSeen ?? new Date(0);
          const requiredReferencedBooksByIsbn13 =
            this.exerciseService.getReferencedBooksByIsbn13(exercise);
          const indexesForLabelStreakAndLastSeen = exerciseLabels.map(
            (exerciseLabel) =>
              <IndexForLabelStreakAndLastSeen>[
                exerciseLabel.labelId,
                streak,
                lastSeen,
              ]
          );
          await this.db.experiences.put({
            exerciseId: exercise.id,
            streak,
            lastSeen,
            qualityLabels: exercise.qualityLabels ?? [],
            indexesForLabelStreakAndLastSeen,
            requiredReferencedBooksByIsbn13,
          });
        });
      }
    );
  }

  getExperienceStreamForStudying({
    labelId,
  }: {
    labelId: string;
  }): Observable<Experience | undefined> {
    return this.studySettingsService.studySettings$.pipe(
      switchMap((studySettings) => {
        const experienceWithStreakOf0ThatShouldBeRetried$ =
          this.getExperienceWithStreakOf0ThatShouldAlreadyBeRetried(
            studySettings,
            labelId
          );
        return combineLatest([
          experienceWithStreakOf0ThatShouldBeRetried$,
          from(
            liveQuery(() =>
              this.db.experiences
                .where('indexesForLabelStreakAndLastSeen')
                // We basically want to look at all experiences with the given label.
                // The nature of the index already guarantees that they are ordered by streak and last seen - just as we like it.
                // Inspired by: https://github.com/dexie/Dexie.js/issues/368
                .between([labelId, -Infinity], [labelId, Infinity], true, true)
                .filter((experience) =>
                  this.isExerciseCurrentlySuitableForStudying({
                    studySettings,
                    experience,
                  })
                )
                .first()
            )
          ),
        ]).pipe(
          map(
            ([
              experienceWithStreakOf0ThatShouldBeRetried,
              regularNextExercise,
            ]) =>
              experienceWithStreakOf0ThatShouldBeRetried ?? regularNextExercise
          )
        );
      })
    );
  }

  /**
   * If available, returns an exercise that has an exercise streak of 0 and the lastSeen is old enough to be retried.
   * This is helpful because we want a special "strategy" for exercises with a streak of 0. For exercises that you are
   * successful at, we pick the oldest exercises first (lowest lastSeen) because the probability that you forgot
   * about them is the highest. For exercises that you failed at, we want a different strategy: There it makes sense
   * to retry very soon so that your new memory gets hardened before you already forgot everything.
   *
   * @param studySettings
   * @param labelId
   */
  private getExperienceWithStreakOf0ThatShouldAlreadyBeRetried(
    studySettings: StudySettings,
    labelId: string
  ) {
    const maxLastSeenDate = addMilliseconds(
      new Date(),
      this.exerciseCooldownService.calculateCooldownMillis({
        formula: studySettings.cooldownFormula,
        correctStreak: 0,
      }) ?? Infinity
    );
    return from(
      liveQuery(() =>
        this.db.experiences
          .where('indexesForLabelStreakAndLastSeen')
          // We basically want to look at all experiences with the given label.
          // The nature of the index already guarantees that they are ordered by streak and last seen - just as we like it.
          // Inspired by: https://github.com/dexie/Dexie.js/issues/368
          .between([labelId, -Infinity], [labelId, maxLastSeenDate], true, true)
          .reverse()
          .filter((experience) =>
            this.isExerciseCurrentlySuitableForStudying({
              studySettings,
              experience,
            })
          )
          .first()
      )
    );
  }

  async onExerciseResult(
    exerciseResult: ExerciseResult,
    studiedLabelId: string
  ) {
    const experience = exerciseResult.exerciseSituation.experience;
    if (!experience) {
      throw Error('not yet implemented');
    }
    const streak =
      exerciseResult.feedback === 'success'
        ? experience.streak + 1
        : exerciseResult.feedback === 'skip'
        ? experience.streak
        : 0;
    const lastSeen = new Date();
    const updatedExperience: Experience = {
      ...experience,
      streak,
      lastSeen,
      indexesForLabelStreakAndLastSeen:
        experience.indexesForLabelStreakAndLastSeen?.map((index) => [
          index[0],
          streak,
          lastSeen,
        ]),
    };
    this.db.experiences.put(updatedExperience);
    this.db.studyEvents.put({
      id: crypto.randomUUID(),
      exerciseId: exerciseResult.exerciseSituation.exercise.id,
      exerciseFeedback: exerciseResult.feedback,
      dateTime: new Date(),
      studiedLabelId,
    });
  }

  getStudyProgress(labelId: string, experience: Experience | undefined) {
    return this.studySettingsService.studySettings$.pipe(
      switchMap((studySettings) => {
        let finishedExercises = 0;
        let upcomingExercises = 0;
        return from(
          liveQuery(() => {
            finishedExercises = 0;
            upcomingExercises = 0;
            return (
              this.db.experiences
                .where('indexesForLabelStreakAndLastSeen')
                // We basically want to look at all experiences with the given label.
                // The nature of the index already guarantees that they are ordered by streak and last seen - just as we like it.
                // Inspired by: https://github.com/dexie/Dexie.js/issues/368
                .between([labelId, -Infinity], [labelId, Infinity], true, true)
                .each((experience) => {
                  const exerciseCurrentlySuitableForStudying =
                    this.isExerciseCurrentlySuitableForStudying({
                      studySettings,
                      experience,
                    });
                  if (exerciseCurrentlySuitableForStudying) {
                    upcomingExercises += 1;
                  } else {
                    finishedExercises += 1;
                  }
                })
            );
          })
        ).pipe(
          map(
            () =>
              ({
                finishedExercises,
                upcomingExercises,
                totalExercises: finishedExercises + upcomingExercises,
                correctStreakOfCurrentExercise: experience?.streak,
              } as StudyProgress)
          )
        );
      })
    );
  }

  private isExerciseCurrentlySuitableForStudying({
    studySettings,
    experience,
  }: {
    studySettings?: StudySettings;
    experience: Experience;
  }) {
    return (
      !this.isExerciseCoolingDown({ studySettings, experience }) &&
      !experience.qualityLabels?.includes('draft')
    );
  }

  private isExerciseCoolingDown({
    studySettings,
    experience,
  }: {
    studySettings?: StudySettings;
    experience: Experience;
  }) {
    const cooldownDurationMillis =
      this.exerciseCooldownService.calculateCooldownMillis({
        formula: studySettings?.cooldownFormula,
        correctStreak: experience.streak,
      });
    const cooldownDuration = cooldownDurationMillis
      ? this.exerciseCooldownService.durationMillisToDuration(
          cooldownDurationMillis
        )
      : { seconds: 30 };
    return experience.lastSeen >= sub(new Date(), cooldownDuration);
  }
}
