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
    if (userData != "") {
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
    //TODO: ここから挙動をコードしてください。
    let score = Player.getHandScore();
    if (score > 21) {
      Player.gameStatus = "bust";
    }
  }

  public blackjackEvaluateAndGetRoundResults() {
    let house = this.house
    let houseScore = house.getHandScore();
    let isBlackJack = this.isBlackJack(house);
    for (let i = 0; i < this.players.length; i++) {
      let curr = this.players[i];
      let currScore = this.players[i].getHandScore();
      let result = "";
      if (curr.gameStatus == "bust") {
        result = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "-" + String(curr.bet);
        curr.chips -= curr.bet;
      } else if (isBlackJack) {
        if (this.isBlackJack(curr)) {
          result = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "0";
        } else {
          result = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "-" + String(curr.bet);
          curr.chips -= curr.bet;
        }
      } else if (house.gameStatus == "bust" || houseScore < currScore) {
        result = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + String(curr.bet * (this.isBlackJack(curr) ? 1.5 : 1));
        curr.chips += curr.bet * (this.isBlackJack(curr) ? 1.5 : 1)
      } else {
        result = "name: " + curr.name + ", action: " + curr.gameStatus + ", bet: " + String(curr.bet) + ", win: " + "-" + String(curr.bet);
        this.players[i].chips -= curr.bet;
      }
      this.resultLog.push(result);
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
    //TODO: ここから挙動をコードしてください。
    return this.players[(this.turnCounter % 3)];
  }

  /*
       Number userData : テーブルモデルの外部から渡されるデータです。
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
  public haveTurn(userData: UserData) {
    // {'betting', 'acting', 'evaluatingWinners, gameOver'}
    //TODO: ここから挙動をコードしてください。
    // 1: テーブルのgamePhaseをチェック
    let currPhase = this.gamePhase;
    // 2: getTurnPlayer()で現在のプレイヤーを取得
    let currPlayer = this.getTurnPlayer;
    // 3: Player.promptPlayer()でプレイヤーのアクションを行う。
    currPlayer.promptPlayer(this, userData);

    // 4: evaluateMove()でプレイヤーの状態を評価
    for (let i = 0; i < this.players.length; i++)
      this.evaluateMove(this.players[i]);

    // 5: turnCounterを増加させる
    this.turnCounter++;
    if (this.turnCounter == 3) this.gamePhase = "acting";
    if (this.allPlayerActionsResolved()) this.gamePhase = "roundOver";
    if (this.turnCounter >= 10) this.gamePhase = "roundOver";
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  public onFirstPlayer(): boolean {
    //TODO: ここから挙動をコードしてください。
    if (this.turnCounter % 3 === 0) return true;
    else return false;
  }

  public onLastPlayer(): boolean {
    //TODO: ここから挙動をコードしてください。
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
    let house = this.house;
    while (house.getHandScore() < 17) {
      house.hand.push(this.deck.drawOne);
    }
    if (house.getHandScore() > 21) house.gameStatus = "bust";
  }

  public isBlackJack(Player: Player) {
    return (Player.getHandScore() === 21 && Player.hand.length === 2)
  }

  public playersHands() {
    for (let player of this.players) {
      console.log("bet: " + player.bet, "score: " + player.getHandScore());
    }
  }

  public newGame() {
    this.blackjackClearPlayerHandsAndBets();
    this.turnCounter = 0;
    this.gamePhase = "betting";
    this.deck = new Deck(this.gameType);
    this.deck.shuffle();
    this.blackjackAssignPlayerHands();
  }
}
