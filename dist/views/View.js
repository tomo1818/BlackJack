var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../consts/cardElement", "../controller/inputController", "../model/Table"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    const cardElement_1 = require("../consts/cardElement");
    const inputController_1 = require("../controller/inputController");
    const Table_1 = require("../model/Table");
    class View {
        constructor(userData) {
            this.firstForm = document.getElementById("initialFromContents");
            this.gameTable = document.getElementById("gameTable");
            this.betContents = document.getElementById("betContents");
            this.betContent = document.getElementsByClassName("betContent");
            this.betButton = document.getElementById("betButton");
            this.housePlayer = document.getElementById("house");
            this.normalPlayers = document.getElementById("players");
            this.actionContents = document.getElementById("actionContents");
            this.actionButtons = document.getElementsByClassName("actionButton");
            this.resultContents = document.getElementById("resultContents");
            this.nextGameButtonContents = document.getElementById("nextGameButtonContents");
            this.nextGameButton = document.getElementById("nextGameButton");
            this.table = new Table_1.Table("blackjack", userData);
            this.firstView();
            this.firstController();
        }
        firstView() {
            this.firstForm.classList.add("hide");
            this.updatePlayerInfo(this.table.house, "create", 0);
            this.updatePlayersInfo("create");
            this.gameTable.classList.remove("hide");
        }
        firstController() {
            // betButtonのクリックイベント
            this.betButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                this.betAction(this.getBetAmount);
                this.updatePlayerInfo(this.table.house, "bet", 0); // house
                this.updatePlayersInfo("bet"); // players
                this.actionView();
                this.resetBetInputView();
            }));
            for (let i = 0; i < this.actionButtons.length; i++) {
                this.actionButtons[i].addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                    console.log("action");
                    const playerAction = e.target.value;
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
                }));
            }
            this.nextGameButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                this.createNewGame();
                this.nextGameView();
            }));
            (0, inputController_1.betInputController)();
            (0, inputController_1.betAmountButtonController)();
        }
        actionView() {
            this.betContents.classList.add("hide");
            this.actionContents.classList.remove("hide");
            if (!this.isDoubleAction())
                this.actionButtons[3].disabled = true;
            else
                this.actionButtons[3].disabled = false;
        }
        resultView() {
            this.actionContents.classList.add("hide");
            this.resultContents.classList.remove("hide");
            this.nextGameButtonContents.classList.remove("hide");
        }
        nextGameView() {
            this.resultContents.classList.add("hide");
            this.nextGameButtonContents.classList.add("hide");
            this.resetPlayersInfo();
            this.firstView();
            this.betContents.classList.remove("hide");
        }
        resetBetInputView() {
            for (let i = 0; i < this.betContent.length; i++) {
                this.betContent[i].querySelector("input").value = "0";
            }
        }
        updatePlayersInfo(type) {
            let players = this.table.players;
            for (let i = 0; i < players.length; i++) {
                this.updatePlayerInfo(players[i], type, i + 1);
            }
        }
        updatePlayerInfo(player, type, index) {
            let tmpComponent = (type === "create") ? this.createPlayerComponent() : document.getElementsByClassName("playerContents")[index];
            tmpComponent.getElementsByClassName("playerName")[0].innerHTML = player.name;
            tmpComponent.getElementsByClassName("playerStatus")[0].innerHTML = "S: " + player.gameStatus + " B: " + player.bet + " C: " + player.chips;
            let cardsComponent = tmpComponent.getElementsByClassName("playerCards")[0];
            player.hand.forEach((card, index) => {
                let cardComponent = (type === "create" || cardsComponent.getElementsByClassName("playerCard")[index] === undefined) ? this.createCardComponent() : cardsComponent.getElementsByClassName("playerCard")[index];
                cardComponent.getElementsByClassName("suit")[0].getElementsByTagName("img")[0].setAttribute("src", cardElement_1.suitImg[card.suit]);
                cardComponent.getElementsByClassName("rank")[0].innerHTML = card.rank;
                if (type == "create" || cardsComponent.getElementsByClassName("playerCard")[index] === undefined) {
                    cardsComponent.append(cardComponent);
                }
            });
            if (type === "create") {
                if (player.name == "house") {
                    this.housePlayer.append(tmpComponent);
                }
                else {
                    this.normalPlayers.append(tmpComponent);
                }
            }
        }
        resetPlayersInfo() {
            this.housePlayer.innerHTML = "";
            this.normalPlayers.innerHTML = "";
        }
        updateResult() {
            this.resultContents.querySelector(".resultText").append("Round: " + String(this.table.gameCounter));
            for (let i = 0; i < this.table.resultLog.length; i++) {
                this.resultContents.querySelector(".resultText").append(this.createResultLog(this.table.resultLog[i]));
            }
        }
        createPlayerComponent() {
            let playerContents = document.createElement("div");
            playerContents.classList.add("playerContents", "d-flex", "flex-wrap", "justify-content-center", "align-items-center", "text-center");
            let playerName = document.createElement("p");
            playerName.id = "playerName";
            playerName.classList.add("playerName", "w-100");
            let playerStatus = document.createElement("p");
            playerStatus.id = "playerStatus";
            playerStatus.classList.add("playerStatus", "w-100");
            let playerCards = document.createElement("div");
            playerCards.id = "playerCards";
            playerCards.classList.add("playerCards", "w-100", "d-flex", "justify-content-center");
            playerContents.append(playerName, playerStatus, playerCards);
            return playerContents;
        }
        createCardComponent() {
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
        betAction(betAmount) {
            while (this.table.gamePhase === "betting") {
                this.table.haveTurn({ action: "bet", bet: betAmount });
            }
        }
        get getBetAmount() {
            let total = 0;
            const betInputContents = document.getElementsByClassName("betInput");
            for (let i = 0; i < betInputContents.length; i++) {
                total += Number(betInputContents[i].value) * Number(this.betContent[i].querySelector("p").innerHTML);
            }
            return total;
        }
        roundAction(userAction) {
            if (this.table.players[0].gameStatus !== "bust" && (userAction === "hit" || userAction === "double")) {
                for (let i = 0; i < this.table.players.length; i++) {
                    this.table.haveTurn({ action: userAction, bet: 0 });
                    this.updatePlayerInfo(this.table.getTurnPlayer, "action", this.table.turnCounter % 3 + 1);
                }
            }
            else {
                while (this.table.gamePhase != "roundOver") {
                    this.table.haveTurn({ action: userAction, bet: 0 });
                    this.updatePlayerInfo(this.table.getTurnPlayer, "action", this.table.turnCounter % 3 + 1);
                }
            }
        }
        isDoubleAction() {
            return (this.table.players[0].bet * 2 <= this.table.players[0].chips);
        }
        createResultLog(log) {
            let logTag = document.createElement("p");
            logTag.innerHTML = log;
            return logTag;
        }
        createNewGame() {
            this.table.newGame();
        }
        houseAction() {
            this.openCard();
            this.table.houseTurn();
        }
        openCard() {
            this.housePlayer.getElementsByClassName("playerCard")[1].classList.add("cardOpen");
        }
    }
    exports.View = View;
});
//# sourceMappingURL=View.js.map