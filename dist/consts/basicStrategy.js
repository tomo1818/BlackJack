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
    exports.basicStrategy = void 0;
    exports.basicStrategy = {
        8: {
            "2": "hit",
            "3": "hit",
            "4": "hit",
            "5": "hit",
            "6": "hit",
            "7": "hit",
            "8": "hit",
            "9": "hit",
            "10": "hit",
            "A": "hit"
        },
        9: {
            "2": "hit",
            "3": "double",
            "4": "double",
            "5": "double",
            "6": "double",
            "7": "hit",
            "8": "hit",
            "9": "hit",
            "10": "hit",
            "A": "hit"
        },
        10: {
            "2": "double",
            "3": "double",
            "4": "double",
            "5": "double",
            "6": "double",
            "7": "double",
            "8": "double",
            "9": "double",
            "10": "hit",
            "A": "hit"
        },
        11: {
            "2": "double",
            "3": "double",
            "4": "double",
            "5": "double",
            "6": "double",
            "7": "double",
            "8": "double",
            "9": "double",
            "10": "double",
            "A": "hit"
        },
        12: {
            "2": "hit",
            "3": "hit",
            "4": "stand",
            "5": "stand",
            "6": "stand",
            "7": "hit",
            "8": "hit",
            "9": "hit",
            "10": "hit",
            "A": "hit"
        },
        13: {
            "2": "stand",
            "3": "stand",
            "4": "stand",
            "5": "stand",
            "6": "stand",
            "7": "hit",
            "8": "hit",
            "9": "hit",
            "10": "hit",
            "A": "hit"
        },
        14: {
            "2": "stand",
            "3": "stand",
            "4": "stand",
            "5": "stand",
            "6": "stand",
            "7": "hit",
            "8": "hit",
            "9": "hit",
            "10": "hit",
            "A": "hit"
        },
        15: {
            "2": "stand",
            "3": "stand",
            "4": "stand",
            "5": "stand",
            "6": "stand",
            "7": "hit",
            "8": "hit",
            "9": "hit",
            "10": "surrender",
            "A": "hit"
        },
        16: {
            "2": "stand",
            "3": "stand",
            "4": "stand",
            "5": "stand",
            "6": "stand",
            "7": "hit",
            "8": "hit",
            "9": "surrender",
            "10": "surrender",
            "A": "surrender"
        },
        17: {
            "2": "stand",
            "3": "stand",
            "4": "stand",
            "5": "stand",
            "6": "stand",
            "7": "stand",
            "8": "stand",
            "9": "stand",
            "10": "stand",
            "A": "stand"
        }
    };
});
//# sourceMappingURL=basicStrategy.js.map