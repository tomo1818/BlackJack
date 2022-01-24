import { Card } from "./Card"
import { Table } from "./Table";
import { GameDecision } from "./GameDecision";
import { UserData } from "../types/type";

export class Player {
  public name: string;
  public type: string;
  public gameType: string;
  public hand: Card[];
  public chips: number = 400;
  public bet: number;
  public winAmount: number;
  public gameStatus: string;

  constructor(name: string, type: string, gameType: string) {
    this.name = name;
    this.type = type;
    this.gameType = gameType;
    this.gameStatus = gameType;
    this.hand = [];
    this.bet = 0;
    this.winAmount = 0;
    this.gameStatus = "betting";
  }

  public promptPlayer(table: Table, userData: UserData): void {
    let decision: GameDecision;
    if (this.gameStatus == "betting") {
      decision = this.betAction(userData);
      this.gameStatus = decision.action;
    } else if (
      this.gameStatus == "acting" ||
      this.gameStatus == "hit" ||
      this.gameStatus == "double"
    ) {
      decision = this.roundAction(table, userData);
      this.gameStatus = decision.action;
    }
  }

  public betAction(userData: UserData) {
    let decision: GameDecision;
    if (this.type === "ai") decision = this.getAiBetDecision();
    else if (this.type === "user") decision = new GameDecision("acting", userData.bet);
    else decision = new GameDecision("acting", 0);
    //TODO: ここから挙動をコードしてください。
    this.bet = decision.amount;
    return decision;
  }

  public roundAction(table: Table, userData: UserData): GameDecision {
    let decision: GameDecision = {action: "", amount: 0};
    if (this.type === "ai") decision = this.getAiRoundDecision(table);
    else if (this.type === "user") decision = new GameDecision(userData.action, userData.bet);
    else decision = new GameDecision("bet", 0);
    this.doRoundAction(table, decision);
    return decision;
  }

  public getHandScore() {
    let score = 0;
    for (let i = 0; i < this.hand.length; i++) {
      score += this.hand[i].getRankNumber;
    }

    return score;
  }

  public getAiBetDecision() {
    let bettingAmounts = 0;
    let currChips = this.chips;
    let hundreds = 0;
    if (hundreds >= 100)
      hundreds += 100 * Math.floor(Math.random() * Math.floor(currChips / 100));
    bettingAmounts += hundreds;
    currChips -= hundreds;
    let fifties = 0;
    if (currChips >= 100) fifties += 50 * Math.floor(Math.random() * (2 + 1));
    else if (currChips >= 50)
      fifties += 50 * Math.floor(Math.random() * (1 + 1));
    bettingAmounts += fifties;
    currChips -= fifties;
    let twenties = 0;
    if (currChips >= 40) twenties += 20 * Math.floor(Math.random() * (2 + 1));
    else if (currChips >= 20)
      twenties += 20 * Math.floor(Math.random() * (1 + 1));
    bettingAmounts += twenties;
    currChips -= twenties;
    let fives = 0;
    if (currChips >= 15) fives += 5 * Math.floor(Math.random() * (3 + 1));
    else if (currChips >= 5) fives += 5 * Math.floor(Math.random() * (1 + 1));
    bettingAmounts += fives;
    currChips -= fives;
    // this.chips = currChips;

    return new GameDecision("acting", bettingAmounts);
  }

  public getAiRoundDecision(table: Table): GameDecision {
    let decision = new GameDecision("", 0);
    let currHandScore = this.getHandScore();
    if (currHandScore >= 15) decision.action = "stand";
    else decision.action = "hit";
    // if (decision.action == "hit") {
    //   this.hand.push(table.deck.drawOne);
    //   if (this.hand.length == 4) decision.action = "stand";
    // }
    return new GameDecision(decision.action, 0);
  }

  public doRoundAction(table: Table, gameDecision: GameDecision) {
    if (gameDecision.action === "hit") {
      this.hand.push(table.deck.drawOne);
      if (this.hand.length == 4) gameDecision.action = "stand";
    }
  }
}
