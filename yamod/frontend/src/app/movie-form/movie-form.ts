import { formatDate } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Genre } from '../genre';
import { GenreService } from '../genre-service';
import { Movie, MovieInput } from '../movie';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-movie-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss',
})
export class MovieForm implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly genreService = inject(GenreService);
  private readonly router = inject(Router);

  id = input<string>();

  error = signal('');
  genres = signal<Genre[]>([]);

  form = new FormGroup({
    rank: new FormControl<number | null>(null),
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    released: new FormControl<Date | string | null>(null),
    run_time: new FormControl<number | null>(null),
    rating: new FormControl<number | null>(null),
    genres: new FormControl<number[]>([], { nonNullable: true }),
    director: new FormControl<number | null>(null),
    actors: new FormControl<number[]>([], { nonNullable: true }),
  });

  constructor() {
    this.genreService.getGenres().subscribe({
      next: (genres) => this.genres.set(genres),
      error: () => this.error.set('The genres could not be loaded.'),
    });
  }

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.movieService.getMovie(Number(id)).subscribe({
        next: (movie) => this.fill(movie),
        error: () => this.error.set(`There is no movie with id ${id}.`),
      });
    }
  }

  save(): void {
    const id = this.id();
    const value = this.form.getRawValue();
    const movie: MovieInput = {
      ...value,
      released: value.released ? formatDate(value.released, 'yyyy-MM-dd', 'en-US') : '',
    };
    const request = id
      ? this.movieService.updateMovie(Number(id), movie)
      : this.movieService.createMovie(movie);

    request.subscribe({
      next: () => this.router.navigate(['/movies']),
      error: () => this.error.set('The movie could not be saved. Check the fields and try again.'),
    });
  }

  private fill(movie: Movie): void {
    this.form.patchValue({
      ...movie,
      genres: movie.genres.map((genre) => genre.id),
      director: movie.director.id,
      actors: movie.actors.map((actor) => actor.id),
    });
  }
}
