import { Routes } from '@angular/router';
import { GenreList } from './genre-list/genre-list';
import { MovieForm } from './movie-form/movie-form';
import { MovieList } from './movie-list/movie-list';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', component: MovieList },
  { path: 'movies/new', component: MovieForm },
  { path: 'movies/:id/edit', component: MovieForm },
  { path: 'genres', component: GenreList },
  { path: '**', redirectTo: 'movies' },
];
