(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.suitImg = exports.rank = exports.suit = void 0;
    exports.suit = ["H", "D", "C", "S"];
    exports.rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    exports.suitImg = {
        "H": "./assets/suit/heart.png",
        "D": "./assets/suit/diamond.png",
        "C": "./assets/suit/clover.png",
        "S": "./assets/suit/spade.png"
    };
});
//# sourceMappingURL=cardElement.js.map