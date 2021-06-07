import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  cards: any = [];
  firstCard: any;
  secondCard: any;
  numberOfCards: number = 20;
  startTime: any;
  duration: any;
  intervalCal: any;
  matchedAudio: any;
  completedAudio: any;
  gameCompleted: boolean = false;

  constructor() {
    this.prepareLayout();
  }

  prepareLayout() {

    for (let i = 0; i < this.numberOfCards; i++) {
      this.cards[i] = { reveal: false, value: i % (this.numberOfCards / 2), matched: false };
    }
    for (let index = 0, randomIndex; index < this.numberOfCards; index++) {
      randomIndex = Math.floor(Math.random() * index);
      [this.cards[index], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[index]];
    }
    this.matchedAudio = new Audio();
    this.completedAudio = new Audio();
    this.matchedAudio.src = './assets/audio/successful-tone.mp3';
    this.completedAudio.src = './assets/audio/successful-tone.mp3';
    this.matchedAudio.load();
    this.completedAudio.load();
  }

  touch(touchedCard: any) {

    if (!this.startTime) {

      this.startTime = performance.now();
      this.duration = '00 : 00';
      this.intervalCal = setInterval(() => {
        let time = new Date(performance.now() - this.startTime);
        let mins = time.getUTCMinutes().toLocaleString('en-US', {
          minimumIntegerDigits: 2, useGrouping: true
        });
        let secs = time.getUTCSeconds().toLocaleString('en-US', {
          minimumIntegerDigits: 2, useGrouping: true
        });
        this.duration = `${mins} : ${secs}`;
      }, 1000);
    }

    if (!touchedCard.reveal) {

      touchedCard.reveal = true;

      if (!this.firstCard)
        this.firstCard = touchedCard;
      else if (!this.secondCard)
        this.secondCard = touchedCard;
      else {
        this.firstCard = touchedCard;
        this.secondCard = undefined;
      }

      if (this.firstCard && this.secondCard && this.firstCard.value === this.secondCard.value) {
        this.firstCard.matched = this.secondCard.matched = true;
        this.firstCard = this.secondCard = undefined;
        this.matchedAudio.play();
      } else this.resetCards(touchedCard);

      if (this.cards.filter((card: any) => { return !card.matched }).length === 0) {
        clearInterval(this.intervalCal);
        this.completedAudio.play();
        this.gameCompleted = true;
      }
    }
  }

  resetCards(touchedCard: any) {

    let openedCards = this.cards.filter((card: any) => { return card.reveal && !card.matched }).length;

    if (openedCards === 3) {
      this.cards.forEach((card: any) => {
        if (card !== touchedCard && !card.matched)
          card.reveal = false;
      });
    }
  }

  resetGame() {
    this.gameCompleted = false;
    this.firstCard = this.secondCard = this.startTime = undefined;
    this.prepareLayout();
    this.duration = '00 : 00';
    clearInterval(this.intervalCal);
  }
}