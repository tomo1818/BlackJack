"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    get getRankNumber() {
        if (this.rank === "J" || this.rank === "Q" || this.rank === "K")
            return 10;
        else if (this.rank === "A")
            return 11;
        else
            return Number(this.rank);
    }
}
exports.Card = Card;
//# sourceMappingURL=Card.js.map