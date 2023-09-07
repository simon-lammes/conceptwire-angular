import { Injectable } from '@angular/core';
import { from, map } from 'rxjs';
import { liveQuery } from 'dexie';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class BookPossessionService {
  readonly booksInPossessionByIsbn13$ = from(
    liveQuery(() =>
      this.db.bookPossessions.filter((x) => x.isInPossession).toArray(),
    ),
  ).pipe(map((x) => x.map((y) => y.isbn13)));

  constructor(private db: DbService) {}
}
