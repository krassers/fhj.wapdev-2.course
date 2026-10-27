import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Movie, MovieInput, Page } from './movie';

@Service()
export class MovieService {
  private readonly http = inject(HttpClient);

  getMovies() {
    return this.http.get<Page<Movie>>('/api/movies/');
  }

  getMovie(id: number) {
    return this.http.get<Movie>(`/api/movies/${id}/`);
  }

  createMovie(movie: MovieInput) {
    return this.http.post<Movie>('/api/movies/', movie);
  }

  updateMovie(id: number, movie: MovieInput) {
    return this.http.put<Movie>(`/api/movies/${id}/`, movie);
  }

  deleteMovie(id: number) {
    return this.http.delete<void>(`/api/movies/${id}/`);
  }
}
