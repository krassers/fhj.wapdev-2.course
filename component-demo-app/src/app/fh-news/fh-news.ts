import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-fh-news',
  imports: [DatePipe],
  templateUrl: './fh-news.html',
  styleUrl: './fh-news.scss',
})
export class FhNews {
  readonly defaultImage = '/image.png';

  title = input<string>('');
  description = input<string>('');
  date = input<Date>(new Date());
  image = input<string | null | undefined>(null);
}
