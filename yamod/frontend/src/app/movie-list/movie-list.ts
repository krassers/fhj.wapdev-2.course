import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Movie, Page } from '../movie';

@Component({
  selector: 'app-movie-list',
  imports: [DatePipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  private readonly http = inject(HttpClient);

  movies = signal<Movie[]>([]);

  constructor() {
    this.http.get<Page<Movie>>('/api/movies/').subscribe({
      next: (page) => this.movies.set(page.items),
    });
  }
}
