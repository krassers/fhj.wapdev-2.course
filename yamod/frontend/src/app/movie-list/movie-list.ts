import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../movie';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-movie-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  private readonly movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.movieService.getMovies().subscribe({
      next: (page) => {
        this.movies.set(page.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('The movies could not be loaded. Is the backend running?');
        this.loading.set(false);
      },
    });
  }

  remove(movie: Movie): void {
    if (!confirm(`Delete "${movie.title}"?`)) {
      return;
    }
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => this.movies.update((movies) => movies.filter((m) => m.id !== movie.id)),
      error: () => this.error.set(`"${movie.title}" could not be deleted.`),
    });
  }
}
