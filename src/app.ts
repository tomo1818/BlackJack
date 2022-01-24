import { View } from "./views/View";
const formButton = document.getElementById("formBtn") as HTMLFormElement;
formButton.addEventListener("click", () => {
  const playerName: string = (document.getElementById("playerName") as HTMLInputElement)!.value as string;
  new View(playerName);
});
