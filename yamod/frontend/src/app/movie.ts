import { Genre } from './genre';

export interface Person {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  rank: number;
  title: string;
  description: string;
  released: string;
  year: number;
  run_time: number;
  rating: number;
  revenue: number | null;
  genres: Genre[];
  director: Person;
  actors: Person[];
}

export interface Page<T> {
  items: T[];
  total: number;
}

export interface MovieInput {
  rank: number | null;
  title: string;
  description: string;
  released: string;
  run_time: number | null;
  rating: number | null;
  genres: number[];
  director: number | null;
  actors: number[];
}
