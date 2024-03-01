export default class GameState {
  constructor() {
    this.heroesList = [];
    this.characterSelected = null;
    this.permissionMove = false;
    this.level = 1;
    this.statistic = [];
    this.points = 0;
    this.deleteRival = [];
  }

  static from(object) {
    if (typeof object === "object") {
      return object;
    }
    return null;
  }
}

console.log(GameState);
