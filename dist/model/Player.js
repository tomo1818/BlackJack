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
            if (this.gameStatus == "betting") {
                decision = this.betAction(userData);
                this.gameStatus = decision.action;
            }
            else if (this.gameStatus == "acting" ||
                this.gameStatus == "hit" ||
                this.gameStatus == "double") {
                decision = this.roundAction(table, userData);
                this.gameStatus = decision.action;
            }
        }
        betAction(userData) {
            let decision;
            if (this.type === "ai")
                decision = this.getAiBetDecision();
            else
                decision = new GameDecision_1.GameDecision("bet", userData.bet);
            //TODO: ここから挙動をコードしてください。
            this.bet = decision.amount;
            return decision;
        }
        roundAction(table, userData) {
            let decision;
            if (this.type === "ai")
                decision = this.getAiRoundDecision(table);
            else
                decision = new GameDecision_1.GameDecision("action", userData.bet);
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
            // this.chips = currChips;
            return new GameDecision_1.GameDecision("acting", bettingAmounts);
        }
        getAiRoundDecision(table) {
            let decision = new GameDecision_1.GameDecision("", 0);
            let currHandScore = this.getHandScore();
            if (currHandScore >= 15)
                decision.action = "stand";
            else
                decision.action = "hit";
            if (decision.action == "hit") {
                this.hand.push(table.deck.drawOne);
                if (this.hand.length == 4)
                    decision.action = "stand";
            }
            return new GameDecision_1.GameDecision(decision.action, 0);
        }
    }
    exports.Player = Player;
});
//# sourceMappingURL=Player.js.map