(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./GameDecision"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    const GameDecision_1 = require("./GameDecision");
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
                decision = this.getAiRoundDecision();
            else if (this.type === "user")
                decision = new GameDecision_1.GameDecision(userData.action, userData.bet);
            else
                decision = new GameDecision_1.GameDecision("bet", 0);
            this.doRoundAction(table, decision);
            return decision;
        }
        getHandScore() {
            let score = 0;
            for (let i = 0; i < this.hand.length; i++) {
                score += this.hand[i].getRankNumber;
            }
            return score;
        }
        getAiBetDecision() {
            let bettingAmounts = 0;
            let currChips = this.chips;
            let hundreds = 0;
            if (hundreds >= 100)
                hundreds += 100 * Math.floor(Math.random() * Math.floor(currChips / 100));
            bettingAmounts += hundreds;
            currChips -= hundreds;
            let fifties = 0;
            if (currChips >= 100)
                fifties += 50 * Math.floor(Math.random() * (2 + 1));
            else if (currChips >= 50)
                fifties += 50 * Math.floor(Math.random() * (1 + 1));
            bettingAmounts += fifties;
            currChips -= fifties;
            let twenties = 0;
            if (currChips >= 40)
                twenties += 20 * Math.floor(Math.random() * (2 + 1));
            else if (currChips >= 20)
                twenties += 20 * Math.floor(Math.random() * (1 + 1));
            bettingAmounts += twenties;
            currChips -= twenties;
            let fives = 0;
            if (currChips >= 15)
                fives += 5 * Math.floor(Math.random() * (3 + 1));
            else if (currChips >= 5)
                fives += 5 * Math.floor(Math.random() * (1 + 1));
            bettingAmounts += fives;
            currChips -= fives;
            return new GameDecision_1.GameDecision("acting", bettingAmounts);
        }
        getAiRoundDecision() {
            const decision = new GameDecision_1.GameDecision("", 0);
            const currHandScore = this.getHandScore();
            if (currHandScore >= 15)
                decision.action = "stand";
            else
                decision.action = "hit";
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
    }
    exports.Player = Player;
});
//# sourceMappingURL=Player.js.map