export class Card {
  public suit: string;
  public rank: string;

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  public get getRankNumber(): number {
    if (this.rank === "J" || this.rank === "Q" || this.rank === "K") return 10;
    else if (this.rank === "A") return 11;
    else return Number(this.rank);
  }
}
