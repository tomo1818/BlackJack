import { Card } from "./Card";
import { suit, rank } from "../consts/cardElement";

export class Deck {
  private gameType: string;
  private cards: Card[];

  constructor(gameType: string) {
    this.gameType = gameType;
    this.cards = [];
    this.resetDeck();
  }

  public resetDeck(): void {
    this.cards = [];
    for (let i = 0; i < suit.length; i++) {
      for (let j = 0; j < rank.length; j++) {
        this.cards.push(new Card(suit[i], rank[j]));
      }
    }
  }

  public shuffle(): void {
    let cardsLen = this.cards.length;
    for (let i = 0; i < this.cards.length; i++) {
      let curr = this.cards[i];
      let ranNum = Math.floor(Math.random() * (cardsLen - 1 - i) + i);
      this.cards[i] = this.cards[ranNum];
      this.cards[ranNum] = curr;
    }
  }

  public get drawOne(): Card {
    let topCard: Card = this.cards[0];
    this.cards.shift()
    return topCard;
  }
}
