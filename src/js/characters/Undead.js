import Character from "../Character";

export default class Undead extends Character {
  constructor(name, type = "Undead") {
    super(name, type);
    this.attack = 40;
    this.defence = 10;
  }
}
console.log(Undead);
