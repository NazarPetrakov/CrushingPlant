import { Component, signal } from '@angular/core';
import { SchemaComponent } from './schema/schema.component';

@Component({
  selector: 'app-root',
  imports: [SchemaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  isAnimationStart = signal(false);

  toggle() {
    this.isAnimationStart.update((v) => !v);
  }
}
