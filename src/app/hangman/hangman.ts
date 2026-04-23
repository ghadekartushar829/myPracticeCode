import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Word {
  word: string;
  hint: string;
}

interface Category {
  name: string;
  icon: string;
  words: Word[];
}

@Component({
  selector: 'app-hangman',
  imports: [CommonModule, FormsModule],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss'
})
export class HangmanComponent implements OnInit {
  categories: Category[] = [
    {
      name: 'Animals',
      icon: '🦁',
      words: [
        { word: 'elephant', hint: 'Large gray animal with a long trunk' },
        { word: 'giraffe', hint: 'Tall animal with a long neck' },
        { word: 'penguin', hint: 'Black and white bird that cannot fly' },
        { word: 'dolphin', hint: 'Intelligent marine mammal' },
        { word: 'butterfly', hint: 'Colorful flying insect' }
      ]
    },
    {
      name: 'Countries',
      icon: '🌍',
      words: [
        { word: 'japan', hint: 'Island nation in East Asia' },
        { word: 'brazil', hint: 'Amazon rainforest country' },
        { word: 'egypt', hint: 'Home to the pyramids' },
        { word: 'norway', hint: 'Known for northern lights' },
        { word: 'australia', hint: 'Home to kangaroos' }
      ]
    },
    {
      name: 'Fruits',
      icon: '🍎',
      words: [
        { word: 'strawberry', hint: 'Red berry with seeds on outside' },
        { word: 'pineapple', hint: 'Tropical fruit with spiky skin' },
        { word: 'watermelon', hint: 'Large green summer fruit' },
        { word: 'mango', hint: 'Yellow tropical fruit, king of fruits' },
        { word: 'blueberry', hint: 'Small round blue berry' }
      ]
    },
    {
      name: 'Movies',
      icon: '🎬',
      words: [
        { word: 'titanic', hint: 'Famous ship movie with Jack and Rose' },
        { word: 'avatar', hint: 'Blue alien world movie' },
        { word: 'inception', hint: 'Movie about dreams within dreams' },
        { word: 'matrix', hint: 'Red pill or blue pill movie' },
        { word: 'jurassic', hint: 'Movie with dinosaurs' }
      ]
    },
    {
      name: 'Sports',
      icon: '⚽',
      words: [
        { word: 'basketball', hint: 'Sport played with a ball and hoop' },
        { word: 'swimming', hint: 'Water sport' },
        { word: 'volleyball', hint: 'Net sport with teams of six' },
        { word: 'tennis', hint: 'Racket sport played on court' },
        { word: 'gymnastics', hint: 'Sport with flips and tumbles' }
      ]
    }
  ];

  selectedCategory: Category | null = null;
  currentWord: Word | null = null;
  displayWord: string[] = [];
  guessedLetters: string[] = [];
  wrongLetters: string[] = [];
  remainingGuesses: number = 6;
  gameOver: boolean = false;
  gameWon: boolean = false;
  gameLost: boolean = false;

  hangmanStages = [
    `
      -----
      |   |
      |
      |
      |
      |
    -----------`,
    `
      -----
      |   |
      |   O
      |
      |
      |
    -----------`,
    `
      -----
      |   |
      |   O
      |   |
      |
      |
    -----------`,
    `
      -----
      |   |
      |   O
      |  \\|
      |
      |
    -----------`,
    `
      -----
      |   |
      |   O
      |  \\|/
      |
      |
    -----------`,
    `
      -----
      |   |
      |   O
      |  \\|/
      |   |
      |
    -----------`,
    `
      -----
      |   |
      |   O
      |  \\|/
      |   |
      |  / \\
    -----------`
  ];

  currentHangman: string = this.hangmanStages[0];
  categoryStats = {
    animals: 0,
    countries: 0,
    fruits: 0,
    movies: 0,
    sports: 0
  };

  ngOnInit() {
    this.loadCategoryStats();
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.startGame();
  }

  startGame() {
    if (!this.selectedCategory) return;

    // Select random word
    const randomIndex = Math.floor(Math.random() * this.selectedCategory.words.length);
    this.currentWord = this.selectedCategory.words[randomIndex];

    // Reset game state
    this.guessedLetters = [];
    this.wrongLetters = [];
    this.remainingGuesses = 6;
    this.gameOver = false;
    this.gameWon = false;
    this.gameLost = false;
    this.currentHangman = this.hangmanStages[0];

    // Initialize display word
    this.displayWord = this.currentWord.word.split('').map(() => '_');
  }

  guessLetter(letter: string) {
    if (!this.currentWord || this.gameOver) return;

    const normalizedLetter = letter.toLowerCase();

    // Check if already guessed
    if (this.guessedLetters.includes(normalizedLetter) || this.wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // Check if letter is in word
    if (this.currentWord.word.includes(normalizedLetter)) {
      this.guessedLetters.push(normalizedLetter);

      // Update display word
      for (let i = 0; i < this.currentWord.word.length; i++) {
        if (this.currentWord.word[i] === normalizedLetter) {
          this.displayWord[i] = normalizedLetter;
        }
      }

      // Check if won
      if (this.displayWord.join('') === this.currentWord.word) {
        this.gameWon = true;
        this.gameOver = true;
        this.updateCategoryStats(true);
      }
    } else {
      this.wrongLetters.push(normalizedLetter);
      this.remainingGuesses--;
      this.currentHangman = this.hangmanStages[6 - this.remainingGuesses];

      // Check if lost
      if (this.remainingGuesses === 0) {
        this.gameLost = true;
        this.gameOver = true;
        this.displayWord = this.currentWord.word.split('');
        this.updateCategoryStats(false);
      }
    }
  }

  isLetterGuessed(letter: string): boolean {
    return this.guessedLetters.includes(letter.toLowerCase());
  }

  isLetterWrong(letter: string): boolean {
    return this.wrongLetters.includes(letter.toLowerCase());
  }

  getAvailableLetters(): string[] {
    const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return allLetters.filter(letter => !this.guessedLetters.includes(letter) && !this.wrongLetters.includes(letter));
  }

  updateCategoryStats(won: boolean) {
    const categoryKey = this.selectedCategory?.name.toLowerCase() as keyof typeof this.categoryStats;
    if (categoryKey in this.categoryStats) {
      this.categoryStats[categoryKey]++;
      this.saveCategoryStats();
    }
  }

  saveCategoryStats() {
    localStorage.setItem('hangmanStats', JSON.stringify(this.categoryStats));
  }

  loadCategoryStats() {
    const saved = localStorage.getItem('hangmanStats');
    if (saved) {
      this.categoryStats = JSON.parse(saved);
    }
  }

  getCategoryStats(categoryName: string): number {
    const key = categoryName.toLowerCase() as keyof typeof this.categoryStats;
    return this.categoryStats[key] || 0;
  }

  resetStats() {
    this.categoryStats = {
      animals: 0,
      countries: 0,
      fruits: 0,
      movies: 0,
      sports: 0
    };
    this.saveCategoryStats();
  }
}
