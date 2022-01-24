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
    exports.betAmountButtonController = exports.betInputController = void 0;
    const betInputController = function () {
        const betInputs = document.getElementsByClassName("betInput");
        for (let i = 0; i < betInputs.length; i++) {
            betInputs[i].addEventListener('focusout', function () {
                minMaxController(betInputs[i]);
            });
        }
    };
    exports.betInputController = betInputController;
    const betAmountButtonController = function () {
        const betContent = document.getElementsByClassName("betContent");
        for (let i = 0; i < betContent.length; i++) {
            let tmp = betContent[i];
            let tmpInput = tmp.querySelector("input");
            let minusButton = tmp.querySelector("#minus");
            let plusButton = tmp.querySelector("#plus");
            minusButton === null || minusButton === void 0 ? void 0 : minusButton.addEventListener("click", function () {
                let currNum = Number(tmpInput.value);
                tmpInput.value = String(currNum - 1);
                minMaxController(tmpInput);
            });
            plusButton.addEventListener("click", function () {
                let currNum = Number(tmpInput.value);
                tmpInput.value = String(currNum + 1);
                minMaxController(tmpInput);
            });
        }
    };
    exports.betAmountButtonController = betAmountButtonController;
    const minMaxController = function (element) {
        if (element.min !== "" && Number(element.value) < Number(element.min)) {
            element.value = element.min;
        }
        else if (element.max !== "" && Number(element.value) > Number(element.max)) {
            element.value = element.max;
        }
    };
});
//# sourceMappingURL=inputController.js.map