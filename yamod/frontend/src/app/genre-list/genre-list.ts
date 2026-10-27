import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Genre } from '../genre';

@Component({
  selector: 'app-genre-list',
  imports: [],
  templateUrl: './genre-list.html',
  styleUrl: './genre-list.scss',
})
export class GenreList {
  private readonly http = inject(HttpClient);

  genres = signal<Genre[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.http.get<Genre[]>('/api/genres/').subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('The genres could not be loaded. Is the backend running?');
        this.loading.set(false);
      },
    });
  }
}
