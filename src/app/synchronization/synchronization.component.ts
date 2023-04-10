import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExerciseService } from '../shared/services/exercise.service';
import { firstValueFrom } from 'rxjs';
import { DbService } from '../shared/services/db.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-synchronization',
  templateUrl: './synchronization.component.html',
  styleUrls: ['./synchronization.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynchronizationComponent {
  constructor(
    private exerciseService: ExerciseService,
    protected route: ActivatedRoute,
    protected dbService: DbService
  ) {}

  async exportIntoDirectory() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const directoryHandle = await showDirectoryPicker({
      mode: 'readwrite',
    });
    const exercisesDirectoryHandle = await directoryHandle.getDirectoryHandle(
      'exercises',
      {
        create: true,
      }
    );
    const exercises = await firstValueFrom(
      this.exerciseService.searchExercises({})
    );
    exercises.map(async (exercise) => {
      const fileHandle = await exercisesDirectoryHandle.getFileHandle(
        `${exercise.id}.html`,
        { create: true }
      );
      const writable = await fileHandle.createWritable();
      await writable.write(exercise.content);
      await writable.close();
    });
  }
}
