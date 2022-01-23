import { suitImg } from "../consts/cardElement";
import { Player } from "../model/Player";
import { Table } from "../model/Table";

export class View {
  private table: Table

  private firstForm = document.getElementById("initialFromContents") as HTMLElement;
  private gameTable = document.getElementById("gameTable") as HTMLElement;
  private gameTableContents = document.getElementById("gameTableContents") as HTMLElement;

  private betContents = document.getElementById("betContents") as HTMLElement;
  private betContent = document.getElementsByClassName("betContent");
  private betButton = document.getElementById("betButton") as HTMLElement;

  private housePlayer = document.getElementById("house") as HTMLElement;
  private normalPlayers = document.getElementById("players") as HTMLElement;

  private actionContents = document.getElementById("actionContents") as HTMLElement;
  private actionButtons = document.getElementsByClassName("actionButton");

  private resultContents = document.getElementById("resultContents") as HTMLElement;

  constructor() {
    this.table = new Table("blackjack");
    this.firstView();
    this.firstController();
  }

  private firstView() {
    this.firstForm.classList.add("hide");
    this.updatePlayersInfo("create");
    this.gameTable.classList.remove("hide");
  }

  private firstController(): void {
    // betButtonのクリックイベント
    this.betButton.addEventListener("click", async () => {
      this.betAction();
      this.updatePlayersInfo("bet");
      this.actionView();
    });

    for (let i = 0; i < this.actionButtons.length; i++) {
      this.actionButtons[i].addEventListener("click", async () => {
        this.roundAction();
        this.updateResult();
        this.resultView();
      });
    }

    for (let i = 0; i < this.betContent.length; i++) {
      let tmp = this.betContent[i];
      let minusButton = tmp.querySelector("#minus")!;
      let plusButton = tmp.querySelector("#plus")!;
      minusButton?.addEventListener("click", function() {
        let currNum: number = Number(tmp.querySelector("input")!.value)
        tmp.querySelector("input")!.value = String(currNum - 1);
      });
      plusButton.addEventListener("click", function() {
        let currNum: number = Number(tmp.querySelector("input")!.value)
        tmp.querySelector("input")!.value = String(currNum + 1);
      });
    }
  }

  private actionView(): void {
    this.betContents.classList.add("hide");
    this.actionContents.classList.remove("hide");
  }

  private resultView(): void {
    this.actionContents.classList.add("hide");
    this.resultContents.classList.remove("hide");
  }

  private updatePlayersInfo(type: string): void {
    let players: Player[] = this.table.players;
    for (let i = 0; i < players.length; i++) {
      this.updatePlayerInfo(players[i], type);
    }
  }

  private updatePlayerInfo(player: Player,type: string): void {
    let tmpComponent = (type === "create") ? this.createPlayerComponent() : (player.name != "house") ? document.getElementsByClassName("playerContents")[this.table.turnCounter % 3 + 1] : document.getElementsByClassName("playerContents")[0];
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

  private updateResult(): void {
    this.resultContents.querySelector(".resultText")!.innerHTML += this.table.resultLog;
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

  private betAction(): void {
    console.log("bet action");
    while (this.table.gamePhase === "betting") {
      this.table.haveTurn({ action: "bet", "bet": 0 });
    }
  }

  private roundAction(): void {
    let i = 1;
    while (this.table.gamePhase != "roundOver") {
      this.table.haveTurn({ action: "action", "bet": 0 });
      this.updatePlayerInfo(this.table.getTurnPlayer, "action");
      i++;
    }

    this.table.houseTurn();
    this.updatePlayerInfo(this.table.players[0], "action");
    this.table.blackjackEvaluateAndGetRoundResults();
  }
}
