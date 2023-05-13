import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { DbService } from '../shared/services/db.service';
import { liveQuery } from 'dexie';
import { PaddedLayoutComponent } from '../shared/components/padded-layout/padded-layout.component';
import { BookPossession } from '../shared/models/book-possession';
import { Book } from '../shared/models/book';
import { combineLatest, from, map, Observable } from 'rxjs';

interface BookPossessionViewModel {
  bookPossession: BookPossession;
  book: Book;
}

@Component({
  selector: 'app-resource-possessions',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, PaddedLayoutComponent],
  templateUrl: './resource-possessions.component.html',
  styleUrls: ['./resource-possessions.component.sass'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcePossessionsComponent {
  readonly bookPossessionsViewModels$: Observable<BookPossessionViewModel[]> =
    combineLatest([
      from(liveQuery(() => this.db.bookPossessions.toArray())),
      from(liveQuery(() => this.db.books.toArray())),
    ]).pipe(
      map(([bookPossessions, books]) =>
        books.map(
          (book) =>
            ({
              book,
              bookPossession: bookPossessions.find(
                (x) => x.isbn13 === book.isbn13
              ) ?? { isbn13: book.isbn13, isInPossession: false },
            } as BookPossessionViewModel)
        )
      )
    );

  constructor(private db: DbService) {}

  async onChange(event: any, vm: BookPossessionViewModel) {
    await this.db.bookPossessions.put({
      isbn13: vm.bookPossession.isbn13,
      isInPossession: event.target.checked,
    });
  }
}
