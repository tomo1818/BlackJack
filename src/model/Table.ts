import { Deck } from "./Deck";
import { Player } from "./Player";
import { playerStatus } from "../consts/playerInfo";
import { UserData } from "../types/type";

export class Table {
  public gameType: string;
  public betDenominations: number[];
  public deck: Deck;
  public gameCounter:number;
  public turnCounter: number;
  public players: Player[];
  public house: Player;
  public gamePhase: string;
  public resultLog: string[];

  constructor(gameType: string, userData: string, betDenominations = [5, 20, 50, 100], resultLog: string[] = []) {
    this.gameType = gameType;
    this.betDenominations = betDenominations;
    this.deck = new Deck(this.gameType);
    this.deck.shuffle();
    this.gameCounter = 1;
    this.turnCounter = 0;
    this.players = [];

    this.house = new Player("house", "house", this.gameType);
    console.log(userData);
    if (userData !== "") {
      this.players.push(new Player(userData, "user", this.gameType));
    }
    while (this.players.length < 3) {
      this.players.push(new Player("ai", "ai", this.gameType));
    }
    this.blackjackAssignPlayerHands();
    this.gamePhase = "betting";
    this.resultLog = resultLog;
  }

  public evaluateMove(Player: Player): void {
    const score = Player.getHandScore();
    if (score > 21) {
      Player.gameStatus = "bust";
    }
  }

  public blackjackEvaluateAndGetRoundResults() {
    const house = this.house
    const houseScore = house.getHandScore();
    const isBlackJack = this.isBlackJack(house);
    for (let i = 0; i < this.players.length; i++) {
      const curr = this.players[i];
      const currScore = this.players[i].getHandScore();
      let resultMessage = "";
      let gameResult = "";
      if (curr.gameStatus === "bust") {
        resultMessage = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "-" + String(curr.bet); // 負け
        curr.chips -= curr.bet;
        gameResult = "lose"
      } else if (isBlackJack) {
        if (this.isBlackJack(curr)) {
          resultMessage = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "0"; // 引き分け
          gameResult = "draw";
        } else {
          resultMessage = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "-" + String(curr.bet); // 負け
          curr.chips -= curr.bet;
          gameResult = "lose";
        }
      } else if (house.gameStatus === "bust" || houseScore < currScore) {
        resultMessage = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + String(curr.bet * (this.isBlackJack(curr) ? 1.5 : 1));
        curr.chips += curr.bet * (this.isBlackJack(curr) ? 1.5 : 1)
        gameResult = "win";
      } else if (curr.gameStatus === "surrender") {
        resultMessage = "name: " + curr.name + ", action: " + curr.gameStatus;
        gameResult = "lose";
      } else {
        resultMessage = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "-" + String(curr.bet);
        this.players[i].chips -= curr.bet;
        gameResult = "lose";
      }
      this.resultLog.push(resultMessage);
      this.players[i].updateMonteCarloArr(gameResult);
    }
  }

  public blackjackAssignPlayerHands() {
    for (let i = 0; i < 2; i++) {
      this.house.hand.push(this.deck.drawOne);
    }
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 2; j++) {
        this.players[i].hand.push(this.deck.drawOne);
      }
    }

  }

  public blackjackClearPlayerHandsAndBets() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand = [];
      this.players[i].gameStatus = "betting";
      this.players[i].bet = 0;
    }

    this.house.hand = [];
    this.house.bet = 0;
  }

  public get getTurnPlayer() {
    return this.players[(this.turnCounter % 3)];
  }

  public haveTurn(userData: UserData) {
    // {'betting', 'acting', 'evaluatingWinners, gameOver'}
    // 1: テーブルのgamePhaseをチェック
    // const currPhase = this.gamePhase;
    // 2: getTurnPlayer()で現在のプレイヤーを取得
    const currPlayer = this.getTurnPlayer;
    // 3: Player.promptPlayer()でプレイヤーのアクションを行う。
    currPlayer.promptPlayer(this, userData);
    // 4: evaluateMove()でプレイヤーの状態を評価
    for (let i = 0; i < this.players.length; i++)
      this.evaluateMove(this.players[i]);

    // 5: turnCounterを増加させる
    this.turnCounter++;
    if (this.turnCounter === 3) this.gamePhase = "acting";
    if (this.allPlayerActionsResolved()) this.gamePhase = "roundOver";
    if (this.turnCounter >= 10) this.gamePhase = "roundOver";
  }

  public onFirstPlayer(): boolean {
    if (this.turnCounter % 3 === 0) return true;
    else return false;
  }

  public onLastPlayer(): boolean {
    if (this.turnCounter % 3 === 2) return true;
    else return false;
  }

  public allPlayerActionsResolved(): boolean {
    for (let i = 1; i < this.players.length; i++) {
      if (!playerStatus.includes(this.players[i].gameStatus)) return false;
    }
    return true;
  }

  public houseTurn() {
    const house = this.house;
    while (house.getHandScore() < 17) {
      house.hand.push(this.deck.drawOne);
    }
    if (house.getHandScore() > 21) house.gameStatus = "bust";
  }

  public isBlackJack(Player: Player) {
    return (Player.getHandScore() === 21 && Player.hand.length === 2)
  }

  public playersHands() {
    for (const player of this.players) {
      console.log("bet: " + player.bet, "score: " + player.getHandScore());
    }
  }

  public newGame() {
    this.blackjackClearPlayerHandsAndBets();
    this.turnCounter = 0;
    this.gameCounter += 1;
    this.gamePhase = "betting";
    this.resultLog = [];
    this.deck = new Deck(this.gameType);
    this.deck.shuffle();
    this.blackjackAssignPlayerHands();
  }
}
