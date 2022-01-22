import { Card } from "./Card";
import { suit, rank } from "../consts/cardElement";

export class Deck {
  private gameType: string;
  private cards: Card[];

  constructor(gameType: string) {
    // このデッキが扱うゲームタイプ
    this.gameType = gameType;

    // カードの配列
    this.cards = [];

    // ゲームタイプによって、カードを初期化してください。
    this.resetDeck();
  }

  public resetDeck(): void {
    this.cards = [];
    //TODO: ここから挙動をコードしてください。
    for (let i = 0; i < suit.length; i++) {
      for (let j = 0; j < rank.length; j++) {
        this.cards.push(new Card(suit[i], rank[j]));
      }
    }
  }

  public shuffle(): void {
    let cardsLen = this.cards.length;
    //TODO: ここから挙動をコードしてください。
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
