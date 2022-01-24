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
    exports.GameDecision = void 0;
    class GameDecision {
        constructor(action, amount) {
            this.action = action;
            this.amount = amount;
        }
    }
    exports.GameDecision = GameDecision;
});
//# sourceMappingURL=GameDecision.js.map