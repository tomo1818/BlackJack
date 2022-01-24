import { suitImg } from "../consts/cardElement";
import { betAmountButtonController, betInputController } from "../controller/inputController";
import { Player } from "../model/Player";
import { Table } from "../model/Table";

export class View {
  private table: Table

  private firstForm = document.getElementById("initialFromContents") as HTMLElement;
  private gameTable = document.getElementById("gameTable") as HTMLElement;

  private betContents = document.getElementById("betContents") as HTMLElement;
  private betContent = document.getElementsByClassName("betContent");
  private betButton = document.getElementById("betButton") as HTMLElement;

  private housePlayer = document.getElementById("house") as HTMLElement;
  private normalPlayers = document.getElementById("players") as HTMLElement;

  private actionContents = document.getElementById("actionContents") as HTMLElement;
  private actionButtons = document.getElementsByClassName("actionButton");

  private resultContents = document.getElementById("resultContents") as HTMLElement;

  private nextGameButtonContents = document.getElementById("nextGameButtonContents") as HTMLElement;
  private nextGameButton = document.getElementById("nextGameButton") as HTMLElement;

  constructor(userData: string) {
    this.table = new Table("blackjack", userData);
    this.firstView();
    this.firstController();
  }

  private firstView() {
    this.firstForm.classList.add("hide");
    this.updatePlayerInfo(this.table.house ,"create", 0);
    this.updatePlayersInfo("create");
    this.gameTable.classList.remove("hide");
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

    for (let i = 0; i < this.actionButtons.length; i++) {
      this.actionButtons[i].addEventListener("click", async (e) => {
        console.log("action");
        const playerAction = (e.target! as HTMLButtonElement).value;
        this.roundAction(playerAction);
        this.updatePlayersInfo("action"); // player
        if (this.table.players[0].gameStatus === "bust" || (playerAction === "stand" || playerAction === "surrender")) {
          this.houseAction();
          this.updatePlayerInfo(this.table.house, "action", 0); // house
          this.updatePlayersInfo("action"); // player
          this.table.blackjackEvaluateAndGetRoundResults();
          this.updateResult();
          this.resultView();
        }
      });
    }

    this.nextGameButton.addEventListener("click", async () => {
      this.createNewGame();
      this.nextGameView();
    });

    betInputController();
    betAmountButtonController();
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

  private updatePlayersInfo(type: string): void {
    let players: Player[] = this.table.players;
    for (let i = 0; i < players.length; i++) {
      this.updatePlayerInfo(players[i], type, i + 1);
    }
  }

  private updatePlayerInfo(player: Player,type: string, index: number): void {
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
    playerCards.classList.add("playerCards", "w-100", "d-flex", "justify-content-center")

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

  private roundAction(userAction: string): void {
    if (this.table.players[0].gameStatus !== "bust" && (userAction === "hit" || userAction === "double")) {
      for (let i = 0; i < this.table.players.length; i++) {
        this.table.haveTurn({ action: userAction, bet: 0 });
        this.updatePlayerInfo(this.table.getTurnPlayer, "action", this.table.turnCounter % 3 + 1);
      }
    } else {
      while (this.table.gamePhase != "roundOver") {
        this.table.haveTurn({ action: userAction, bet: 0 });
        this.updatePlayerInfo(this.table.getTurnPlayer, "action", this.table.turnCounter % 3 + 1);
      }
    }
  }

  private isDoubleAction(): boolean {
    return (this.table.players[0].bet * 2 <= this.table.players[0].chips)
  }

  private createResultLog(log: string): HTMLElement {
    let logTag = document.createElement("p");
    logTag.innerHTML = log;
    return logTag;
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
}
