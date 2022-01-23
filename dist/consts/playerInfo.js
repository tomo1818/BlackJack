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
    exports.playerActions = exports.playerStatus = void 0;
    exports.playerStatus = ["broken", "bust", "stand", "surrender"];
    exports.playerActions = ["bet", "surrender", "stand", "hit", "double"];
});
//# sourceMappingURL=playerInfo.js.map