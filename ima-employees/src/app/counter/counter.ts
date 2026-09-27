import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  readonly milestones = [3, 5, 10];

  count = signal(0);
  label = computed(() => (this.count() === 1 ? '1 click' : `${this.count()} clicks`));
  reached = computed(() => this.milestones.filter((milestone) => milestone <= this.count()));

  increment(): void {
    this.count.update((count) => count + 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
