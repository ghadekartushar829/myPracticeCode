import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Demo } from "./demo/demo";
import { ImageGallary } from './image-gallary/image-gallary';
import { HangmanComponent } from './hangman/hangman';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ImageGallary, HangmanComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-first-angular-app');
  activeComponent = 'hangman';
}
