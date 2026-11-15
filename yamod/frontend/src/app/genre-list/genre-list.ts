import { Component, inject, signal } from '@angular/core';
import { Genre } from '../genre';
import { GenreService } from '../genre-service';

@Component({
  selector: 'app-genre-list',
  imports: [],
  templateUrl: './genre-list.html',
  styleUrl: './genre-list.scss',
})
export class GenreList {
  private readonly genreService = inject(GenreService);

  genres = signal<Genre[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.genreService.getGenres().subscribe({
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
