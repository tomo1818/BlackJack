import { Deck } from "./Deck";
import { Player } from "./Player";
import { playerStatus } from "../consts/playerInfo";
import { UserData } from "../types/type";

export class Table {
  public gameType: string;
  public betDenominations: number[];
  public deck: Deck;
  public turnCounter: number;
  public players: Player[];
  public house: Player;
  public gamePhase: string;
  public resultLog: string[];

  constructor(gameType: string, betDenominations = [5, 20, 50, 100], resultLog: string[] = []) {
    // ゲームタイプを表します。
    this.gameType = gameType;

    // プレイヤーが選択できるベットの単位。
    this.betDenominations = betDenominations;

    // テーブルのカードのデッキ
    this.deck = new Deck(this.gameType);
    this.deck.shuffle();

    this.turnCounter = 0;

    // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
    // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
    this.players = [];

    // プレイヤーをここで初期化してください。
    this.house = new Player("house", "house", this.gameType);
    this.players.push(this.house);
    this.players.push(new Player("ai_1", "ai", this.gameType));
    this.players.push(new Player("ai_2", "ai", this.gameType));
    this.players.push(new Player("ai_3", "ai", this.gameType));
    this.blackjackAssignPlayerHands();
    this.gamePhase = "betting";

    // これは各ラウンドの結果をログに記録するための文字列の配列です。
    this.resultLog = resultLog;
  }
  /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
  public evaluateMove(Player: Player): void {
    //TODO: ここから挙動をコードしてください。
    let score = Player.getHandScore();
    if (score > 21) {
      Player.gameStatus = "bust";
    }
  }

  public blackjackEvaluateAndGetRoundResults() {
    let house = this.players[0]
    let houseScore = house.getHandScore();
    let isBlackJack = this.isBlackJack(house);
    for (let i = 1; i < this.players.length; i++) {
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
        curr.chips -= curr.bet;
      }
      this.resultLog.push(result);
    }
  }

  public blackjackAssignPlayerHands() {
    //TODO: ここから挙動をコードしてください。
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 2; j++) {
        this.players[i].hand.push(this.deck.drawOne);
      }
    }
  }

  public blackjackClearPlayerHandsAndBets() {
    //TODO: ここから挙動をコードしてください。
    // this.players = this.players.map(value => []);
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand = [];
      this.players[i].bet = 0;
    }
  }

  public get getTurnPlayer() {
    //TODO: ここから挙動をコードしてください。
    return this.players[(this.turnCounter % 3) + 1];
  }

  /*
       Number userData : テーブルモデルの外部から渡されるデータです。
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
  haveTurn(userData: UserData) {
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
    if (this.allPlayerActionsResolved()) this.gamePhase = "roundOver";
    if (this.turnCounter >= 10) this.gamePhase = "roundOver";
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  onFirstPlayer() {
    //TODO: ここから挙動をコードしてください。
    if (this.turnCounter % 3 === 0) return true;
    else return false;
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  onLastPlayer() {
    //TODO: ここから挙動をコードしてください。
    if (this.turnCounter % 3 === 2) return true;
    else return false;
  }

  /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
  allPlayerActionsResolved() {
    //TODO: ここから挙動をコードしてください。
    for (let i = 1; i < this.players.length; i++) {
      if (!playerStatus.includes(this.players[i].gameStatus)) return false;
    }
    return true;
  }

  houseTurn() {
    let house = this.players[0]
    while (house.getHandScore() < 17) {
      house.hand.push(this.deck.drawOne);
    }
    if (house.getHandScore() > 21) house.gameStatus = "bust";
  }

  isBlackJack(Player: Player) {
    return (Player.getHandScore() === 21 && Player.hand.length === 2)
  }

  playersHands() {
    for (let player of this.players) {
      console.log(player.hand)
      console.log("bet: " + player.bet, "score: " + player.getHandScore());
    }
  }
}
