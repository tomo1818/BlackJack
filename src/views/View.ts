import { suitImg } from "../consts/cardElement";
import { Player } from "../model/Player";
import { Table } from "../model/Table";

export class View {
  private table: Table
  private mainPlayer: Player;

  private firstForm = document.getElementById("initialFromContents") as HTMLElement;
  private gameTable = document.getElementById("gameTable") as HTMLElement;

  private betContents = document.getElementById("betContents") as HTMLElement;
  private betContent = document.getElementsByClassName("betContent");
  private betInputs = document.getElementsByClassName("betInput");
  private betButton = document.getElementById("betButton") as HTMLButtonElement;
  private betErrorText = document.getElementById("betErrorText") as HTMLElement;

  private housePlayer = document.getElementById("house") as HTMLElement;
  private normalPlayers = document.getElementById("players") as HTMLElement;

  private actionContents = document.getElementById("actionContents") as HTMLElement;
  private actionButtons = document.getElementsByClassName("actionButton");

  private resultContents = document.getElementById("resultContents") as HTMLElement;

  private nextGameButtonContents = document.getElementById("nextGameButtonContents") as HTMLElement;
  private nextGameButton = document.getElementById("nextGameButton") as HTMLElement;

  constructor(userData: string) {
    this.table = new Table("blackjack", userData);
    this.mainPlayer = this.table.players[0];
    this.firstView();
    this.firstController();
  }

  private async firstView() {
    this.firstForm.classList.add("hide");
    this.gameTable.classList.remove("hide");
    await this.updatePlayerInfo(this.table.house, "create", 0);
    await this.updatePlayersInfo("create");
  }

  private firstController(): void {
    // betButtonのクリックイベント
    this.betButton.addEventListener("click", async () => {
      this.betAction(this.getBetAmount);
      this.updatePlayerInfo(this.table.house, "bet", 0) // house
      this.updatePlayersInfo("bet"); // players
      this.actionView();
      this.resetBetInputView();
    });

    // actionButtonのクリックイベント
    for (let i = 0; i < this.actionButtons.length; i++) {
      this.actionButtons[i].addEventListener("click", async (e): Promise<void> => {
        const playerAction = (e.target! as HTMLButtonElement).value;
        await this.roundAction(playerAction);
        this.updatePlayersInfo("action"); // player
        if (this.mainPlayer.gameStatus === "bust" || (playerAction === "stand" || playerAction === "surrender")) {
          await this.wait(1);
          this.houseAction();
          this.updatePlayerInfo(this.table.house, "action", 0); // house
          await this.wait(1);
          this.updatePlayersInfo("action"); // player
          this.table.blackjackEvaluateAndGetRoundResults();
          this.updateResult();
          this.resultView();
        }
      });
    }

    // nextGameButtonのクリックイベント
    this.nextGameButton.addEventListener("click", async (): Promise<void> => {
      this.createNewGame();
      this.nextGameView();
    });

    // betInputController(); input要素を操作時のfocusoutイベント
    for (let i = 0; i < this.betInputs.length; i++) {
      this.betInputs[i].addEventListener('focusout', async (): Promise<void> => {
        this.minMaxController(this.betInputs[i] as HTMLInputElement);
        this.isBetErrorText(this.isBet(this.mainPlayer));
      });
    }

    // betAmountButtonController(); plus,minusボタンでの操作時のクリックイベント
    for (let i = 0; i < this.betContent.length; i++) {
      let tmp = this.betContent[i];
      let tmpInput = tmp.querySelector("input")! as HTMLInputElement;
      let minusButton = tmp.querySelector("#minus")!;
      let plusButton = tmp.querySelector("#plus")!;
      minusButton?.addEventListener("click", async (): Promise<void> => {
        let currNum: number = Number(tmpInput.value)
        tmpInput.value = String(currNum - 1);
        this.minMaxController(tmpInput);
        this.isBetErrorText(this.isBet(this.mainPlayer));
      });
      plusButton.addEventListener("click", async (): Promise<void> => {
        let currNum: number = Number(tmpInput.value)
        tmpInput.value = String(currNum + 1);
        this.minMaxController(tmpInput);
        this.isBetErrorText(this.isBet(this.mainPlayer));
      });
    }
  }

  private actionView(): void {
    this.betContents.classList.add("hide");
    this.actionContents.classList.remove("hide");
    if (!this.isDoubleAction()) (this.actionButtons[3] as HTMLButtonElement).disabled = true;
    else (this.actionButtons[3] as HTMLButtonElement).disabled = false;
  }

  private resultView(): void {
    this.actionContents.classList.add("hide");
    this.resultContents.classList.remove("hide");
    this.nextGameButtonContents.classList.remove("hide");
  }

  private nextGameView(): void{
    this.resultContents.classList.add("hide");
    this.nextGameButtonContents.classList.add("hide");
    this.resetPlayersInfo()

    this.firstView();
    this.betContents.classList.remove("hide");
  }

  private resetBetInputView(): void {
    for (let i = 0; i < this.betContent.length; i++) {
      this.betContent[i].querySelector("input")!.value = "0"
    }
  }

  private async updatePlayersInfo(type: string): Promise<void> {
    let players: Player[] = this.table.players;
    for (let i = 0; i < players.length; i++) {
      await this.updatePlayerInfo(players[i], type, i + 1);
    }
  }

  private async updatePlayerInfo(player: Player,type: string, index: number): Promise<void> {
    let tmpComponent = (type === "create") ? this.createPlayerComponent() : document.getElementsByClassName("playerContents")[index];
    tmpComponent.getElementsByClassName("playerName")[0].innerHTML = player.name;
    tmpComponent.getElementsByClassName("playerStatus")[0].innerHTML = "S: " + player.gameStatus + " B: " + player.bet + " C: " + player.chips;
    let cardsComponent = tmpComponent.getElementsByClassName("playerCards")[0];
    player.hand.forEach((card, index) => {
      let cardComponent = (type === "create" || cardsComponent.getElementsByClassName("playerCard")[index] === undefined) ? this.createCardComponent() : cardsComponent.getElementsByClassName("playerCard")[index];
      cardComponent.getElementsByClassName("suit")[0].getElementsByTagName("img")[0].setAttribute("src", suitImg[card.suit]);
      cardComponent.getElementsByClassName("rank")[0].innerHTML = card.rank;
      if (type == "create" || cardsComponent.getElementsByClassName("playerCard")[index] === undefined) {
        cardsComponent.append(cardComponent);
      }
    });
    if (type === "create") {
      if (player.name == "house") {
        this.housePlayer.append(tmpComponent);
      } else {
        this.normalPlayers.append(tmpComponent);
      }
      await this.wait(1); // 初期状態の時のみwaitを入れる。
    }
  }

  private resetPlayersInfo(): void {
    this.housePlayer.innerHTML = ""
    this.normalPlayers.innerHTML = "";
  }

  private updateResult(): void {
    this.resultContents.querySelector(".resultText")!.append("Round: " + String(this.table.gameCounter));
    for (let i = 0; i < this.table.resultLog.length; i++) {
      this.resultContents.querySelector(".resultText")!.append(this.createResultLog(this.table.resultLog[i]));
    }
  }

  private createPlayerComponent(): HTMLElement {
    let playerContents = document.createElement("div")
    playerContents.classList.add("playerContents", "d-flex", "flex-wrap", "justify-content-center", "align-items-center", "text-center");
    let playerName = document.createElement("p");
    playerName.id = "playerName";
    playerName.classList.add("playerName", "w-100");
    let playerStatus = document.createElement("p");
    playerStatus.id = "playerStatus";
    playerStatus.classList.add("playerStatus", "w-100");
    let playerCards = document.createElement("div");
    playerCards.id = "playerCards";
    playerCards.classList.add("playerCards", "w-100", "d-flex");

    playerContents.append(playerName, playerStatus, playerCards);

    return playerContents;
  }

  private createCardComponent(): HTMLElement {
    let container = document.createElement("div");
    container.classList.add("playerCard");
    let suit = document.createElement("div");
    suit.classList.add("suit", "w-100");
    let suitImg = document.createElement("img");
    suit.append(suitImg);
    let rank = document.createElement("div");
    rank.classList.add("rank", "w-100");

    container.append(suit, rank);

    return container;
  }

  private betAction(betAmount: number): void {
    while (this.table.gamePhase === "betting") {
      this.table.haveTurn({ action: "bet", bet: betAmount });
    }
  }

  private get getBetAmount(): number {
    let total = 0;
    const betInputContents = document.getElementsByClassName("betInput");
    for (let i = 0; i < betInputContents.length; i++) {
      total += Number((betInputContents[i]! as HTMLInputElement).value) * Number(this.betContent[i].querySelector("p")!.innerHTML);
    }
    return total;
  }

  private async roundAction(userAction: string): Promise<void> {
    if (this.mainPlayer.gameStatus !== "bust" && (userAction === "hit" || userAction === "double")) {
      for (let i = 0; i < this.table.players.length; i++) {
        await this.oneRoundAction(userAction);
      }
    } else {
      while (this.table.gamePhase != "roundOver") {
        await this.oneRoundAction(userAction);
      }
    }
  }

  private async oneRoundAction(userAction: string): Promise<void> {
    try {
      await this.wait(1); // 1秒静止
      console.log("wait 1 second");
      this.table.haveTurn({ action: userAction, bet: 0 });
      // this.updatePlayerInfo(this.table.getTurnPlayer, "action", this.table.turnCounter % 3 + 1);
      this.updatePlayersInfo("action");
    } catch (err) {
      console.error(err);
    }
  }

  private isDoubleAction(): boolean {
    return (this.mainPlayer.bet * 2 <= this.mainPlayer.chips)
  }

  private createResultLog(log: string): HTMLElement {
    let logElement = document.createElement("p");
    logElement.innerHTML = log;
    return logElement;
  }

  private createNewGame(): void {
    this.table.newGame();
  }

  private houseAction(): void {
    this.openCard();
    this.table.houseTurn();
  }

  private openCard(): void {
    this.housePlayer.getElementsByClassName("playerCard")[1].classList.add("cardOpen")
  }

  private isBetErrorText(isBet: boolean): void {
    if (isBet) {
      this.betErrorText.classList.add("hide");
      this.betButton.disabled = false;
    } else {
      this.betErrorText.classList.remove("hide");
      this.betButton.disabled = true;
    }
  }

  private isBet(player: Player): boolean {
    return player.chips >= this.getBetAmount;
  }

  private minMaxController(element: HTMLInputElement): void {
    if (element.min !== "" && Number(element.value) < Number(element.min)) {
      element.value = element.min;
    } else if (element.max !== "" && Number(element.value) > Number(element.max)) {
      element.value = element.max;
    }
  }

  private wait(sec: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, sec * 1000);
      //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
    });
  };
}
