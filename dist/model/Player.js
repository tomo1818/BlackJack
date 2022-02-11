(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./GameDecision", "../consts/basicStrategy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    const GameDecision_1 = require("./GameDecision");
    const basicStrategy_1 = require("../consts/basicStrategy");
    class Player {
        constructor(name, type, gameType) {
            this.chips = 400;
            this.name = name;
            this.type = type;
            this.gameType = gameType;
            this.gameStatus = gameType;
            this.hand = [];
            this.bet = 0;
            this.winAmount = 0;
            this.gameStatus = "betting";
            this.monteCarloArr = [5, 10, 15];
        }
        promptPlayer(table, userData) {
            let decision;
            if (this.gameStatus === "betting") {
                decision = this.betAction(userData);
                this.gameStatus = decision.action;
            }
            else if (this.gameStatus === "acting" ||
                this.gameStatus === "hit" ||
                this.gameStatus === "double") {
                decision = this.roundAction(table, userData);
                this.gameStatus = decision.action;
            }
        }
        betAction(userData) {
            let decision;
            if (this.type === "ai")
                decision = this.getAiBetDecision();
            else if (this.type === "user")
                decision = new GameDecision_1.GameDecision("acting", userData.bet);
            else
                decision = new GameDecision_1.GameDecision("acting", 0);
            this.bet = decision.amount;
            return decision;
        }
        roundAction(table, userData) {
            let decision = { action: "", amount: 0 };
            if (this.type === "ai")
                decision = this.getAiRoundDecision(table);
            else if (this.type === "user")
                decision = new GameDecision_1.GameDecision(userData.action, userData.bet);
            else
                decision = new GameDecision_1.GameDecision("bet", 0);
            this.doRoundAction(table, decision);
            return decision;
        }
        getHandScore() {
            let score = 0;
            // const isAce = this.isAce();
            for (let i = 0; i < this.hand.length; i++) {
                score += this.hand[i].getRankNumber;
            }
            // if (isAce >= 1) {
            // }
            return score;
        }
        // public isAce(): number {
        //   let count = 0;
        //   for (let i = 0; i < this.hand.length; i++) {
        //     if (this.hand[i].rank === "A") count += 1;
        //   }
        //   return count
        // }
        getAiBetDecision() {
            let bettingAmounts = 0;
            // モンテカルロ法
            bettingAmounts = this.monteCarloArr[0] + this.monteCarloArr.slice(-1)[0];
            // ランダム
            // let currChips = this.chips;
            // let hundreds = 0;
            // if (hundreds >= 100)
            //   hundreds += 100 * Math.floor(Math.random() * Math.floor(currChips / 100));
            // bettingAmounts += hundreds;
            // currChips -= hundreds;
            // let fifties = 0;
            // if (currChips >= 100) fifties += 50 * Math.floor(Math.random() * (2 + 1));
            // else if (currChips >= 50)
            //   fifties += 50 * Math.floor(Math.random() * (1 + 1));
            // bettingAmounts += fifties;
            // currChips -= fifties;
            // let twenties = 0;
            // if (currChips >= 40) twenties += 20 * Math.floor(Math.random() * (2 + 1));
            // else if (currChips >= 20)
            //   twenties += 20 * Math.floor(Math.random() * (1 + 1));
            // bettingAmounts += twenties;
            // currChips -= twenties;
            // let fives = 0;
            // if (currChips >= 15) fives += 5 * Math.floor(Math.random() * (3 + 1));
            // else if (currChips >= 5) fives += 5 * Math.floor(Math.random() * (1 + 1));
            // bettingAmounts += fives;
            // currChips -= fives;
            return new GameDecision_1.GameDecision("acting", bettingAmounts);
        }
        getAiRoundDecision(table) {
            const decision = new GameDecision_1.GameDecision("", 0);
            let currHandScore = this.getHandScore();
            let openCard = table.house.hand[0].rank;
            if (openCard === "J" || openCard === "Q" || openCard === "K") {
                openCard = "10";
            }
            if (currHandScore <= 7) {
                currHandScore = 8;
            }
            else if (currHandScore >= 18) {
                currHandScore = 17;
            }
            decision.action = basicStrategy_1.basicStrategy[currHandScore][openCard];
            return new GameDecision_1.GameDecision(decision.action, 0);
        }
        doRoundAction(table, gameDecision) {
            if (gameDecision.action === "hit" || gameDecision.action === "double") {
                this.hand.push(table.deck.drawOne);
                if (gameDecision.action === "double") {
                    this.bet *= 2;
                }
                // if (this.hand.length === 4) gameDecision.action = "stand";
            }
            else if (gameDecision.action === "surrender") {
                this.chips -= this.bet;
                this.bet = 0;
            }
        }
        updateMonteCarloArr(gameResult) {
            const len = this.monteCarloArr.length;
            if (gameResult === "win") {
                this.monteCarloArr.shift();
                this.monteCarloArr.pop();
                if (len <= 3) {
                    this.monteCarloArr = [5, 10, 15];
                }
            }
            else if (gameResult === "lose") {
                this.monteCarloArr.push(this.monteCarloArr[len - 1] + 5);
            }
        }
    }
    exports.Player = Player;
});
//# sourceMappingURL=Player.js.map
