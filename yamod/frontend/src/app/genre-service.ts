import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Genre } from './genre';

@Service()
export class GenreService {
  private readonly http = inject(HttpClient);

  getGenres() {
    return this.http.get<Genre[]>('/api/genres/');
  }

  createGenre(genre: { name: string }) {
    return this.http.post<Genre>('/api/genres/', genre);
  }
}
