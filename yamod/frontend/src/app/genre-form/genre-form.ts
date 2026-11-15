import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GenreService } from '../genre-service';

@Component({
  selector: 'app-genre-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './genre-form.html',
  styleUrl: './genre-form.scss',
})
export class GenreForm {
  private readonly genreService = inject(GenreService);
  private readonly router = inject(Router);

  error = signal('');

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
  });

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.genreService.createGenre(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/genres']),
      error: () => this.error.set('The genre could not be saved.'),
    });
  }
}
