import { CardElement } from "../types/type";

export const suit: CardElement = ["H", "D", "C", "S"];
export const rank: CardElement = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const suitImg: {[key: string]: string} = {
  "H": "./assets/suit/heart.png",
  "D": "./assets/suit/diamond.png",
  "C": "./assets/suit/clover.png",
  "S": "./assets/suit/spade.png"
}
