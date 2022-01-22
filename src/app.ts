import { View } from "./views/View";
const formButton = document.getElementById("formBtn") as HTMLFormElement;
formButton.addEventListener("click", () => new View());
