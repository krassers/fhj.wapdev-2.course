import { Component, signal } from '@angular/core';
import { AlertButton } from './alert-button/alert-button';
import { FhNews } from './fh-news/fh-news';

@Component({
  selector: 'app-root',
  imports: [AlertButton, FhNews],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('component-demo-app');

  readonly firstNewsDate = new Date('2026-09-14');
}
