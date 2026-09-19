import { Component, signal } from '@angular/core';
import { AlertButton } from './alert-button/alert-button';
import { FhNews } from './fh-news/fh-news';

interface NewsItem {
  title: string;
  description: string;
  date: Date;
  image?: string | null;
}

@Component({
  selector: 'app-root',
  imports: [AlertButton, FhNews],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('component-demo-app');

  news: NewsItem[] = [
    {
      title: 'New Campus Opening',
      description: 'A new campus wing focused on sustainable technology has officially opened.',
      date: new Date('2026-09-14'),
      image: null,
    },
    {
      title: 'Research Grant Awarded',
      description: 'Faculty secured a major grant to advance AI ethics research across departments.',
      date: new Date('2026-09-05'),
      image: null,
    },
    {
      title: 'Student Hackathon',
      description: 'Over 300 students showcased innovative projects at the annual hackathon.',
      date: new Date('2026-07-20'),
      image: 'https://cdn3.fh-joanneum.at/media/2023/04/woechentlicher-boersenbrief-von-josef-obergantschnig-2-2048x1366.jpg',
    },
    {
      title: 'Alumni Meetup',
      description: 'An informal alumni meetup was held downtown; no image was provided for this event.',
      date: new Date('2026-05-20'),
      image: 'https://cdn3.fh-joanneum.at/media/2025/11/Header_30Jahre_Baustudiengaenge_ZukunftsplattformBauen_25.jpg',
    },
  ];
}
