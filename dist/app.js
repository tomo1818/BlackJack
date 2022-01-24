(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./views/View"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const View_1 = require("./views/View");
    const formButton = document.getElementById("formBtn");
    formButton.addEventListener("click", () => {
        const playerName = document.getElementById("playerName").value;
        new View_1.View(playerName);
    });
});
//# sourceMappingURL=app.js.map