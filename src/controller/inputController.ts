export const betInputController = function(): void {
  const betInputs = document.getElementsByClassName("betInput");

  for (let i = 0; i < betInputs.length; i++) {
    betInputs[i].addEventListener('focusout', function (): void {
      minMaxController(betInputs[i] as HTMLInputElement)
    });
  }
}

export const betAmountButtonController = function(): void {
  const betContent = document.getElementsByClassName("betContent");

  for (let i = 0; i < betContent.length; i++) {
    let tmp = betContent[i];
    let tmpInput = tmp.querySelector("input")! as HTMLInputElement;
    let minusButton = tmp.querySelector("#minus")!;
    let plusButton = tmp.querySelector("#plus")!;
    minusButton?.addEventListener("click", function () {
      let currNum: number = Number(tmpInput.value)
      tmpInput.value = String(currNum - 1);
      minMaxController(tmpInput);
    });
    plusButton.addEventListener("click", function () {
      let currNum: number = Number(tmpInput.value)
      tmpInput.value = String(currNum + 1);
      minMaxController(tmpInput);
    });
  }
}

const minMaxController = function (element: HTMLInputElement): void {
  if (element.min !== "" && Number(element.value) < Number(element.min)) {
    element.value = element.min;
  } else if (element.max !== "" && Number(element.value) > Number(element.max)) {
    element.value = element.max;
  }
}
