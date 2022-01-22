export class GameDecision {
  public action: string;
  public amount: number;

  constructor(action: string, amount: number) {
    // アクション
    this.action = action;
    // プレイヤーが選択する数値
    this.amount = amount;
  }
}
