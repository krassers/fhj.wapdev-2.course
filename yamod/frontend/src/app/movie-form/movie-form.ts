import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../movie';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-movie-form',
  imports: [ReactiveFormsModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss',
})
export class MovieForm implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  id = input<string>();

  error = signal('');

  form = new FormGroup({
    rank: new FormControl<number | null>(null),
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    released: new FormControl('', { nonNullable: true }),
    run_time: new FormControl<number | null>(null),
    rating: new FormControl<number | null>(null),
    genres: new FormControl<number[]>([], { nonNullable: true }),
    director: new FormControl<number | null>(null),
    actors: new FormControl<number[]>([], { nonNullable: true }),
  });

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
    const movie = this.form.getRawValue();
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
