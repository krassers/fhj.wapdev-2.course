import { Component, signal } from '@angular/core';
import { GenreList } from './genre-list/genre-list';

@Component({
  selector: 'app-root',
  imports: [GenreList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('yamod');
}
