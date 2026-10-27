import { Component, signal } from '@angular/core';
import { GenreList } from './genre-list/genre-list';
import { MovieList } from './movie-list/movie-list';

@Component({
  selector: 'app-root',
  imports: [GenreList, MovieList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('yamod');
}
