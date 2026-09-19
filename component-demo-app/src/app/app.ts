import { Component, signal } from '@angular/core';
import { AlertButton } from './alert-button/alert-button';

@Component({
  selector: 'app-root',
  imports: [AlertButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('component-demo-app');
}
