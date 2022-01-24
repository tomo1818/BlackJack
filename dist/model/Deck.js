(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Card", "../consts/cardElement"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deck = void 0;
    const Card_1 = require("./Card");
    const cardElement_1 = require("../consts/cardElement");
    class Deck {
        constructor(gameType) {
            this.gameType = gameType;
            this.cards = [];
            this.resetDeck();
        }
        resetDeck() {
            this.cards = [];
            for (let i = 0; i < cardElement_1.suit.length; i++) {
                for (let j = 0; j < cardElement_1.rank.length; j++) {
                    this.cards.push(new Card_1.Card(cardElement_1.suit[i], cardElement_1.rank[j]));
                }
            }
        }
        shuffle() {
            const cardsLen = this.cards.length;
            for (let i = 0; i < this.cards.length; i++) {
                const curr = this.cards[i];
                const ranNum = Math.floor(Math.random() * (cardsLen - 1 - i) + i);
                this.cards[i] = this.cards[ranNum];
                this.cards[ranNum] = curr;
            }
        }
        get drawOne() {
            const topCard = this.cards[0];
            this.cards.shift();
            return topCard;
        }
    }
    exports.Deck = Deck;
});
//# sourceMappingURL=Deck.js.map