import Character from "../Character";

export default class Vampire extends Character {
  constructor(name, type = "Vampire") {
    super(name, type);
    this.attack = 25;
    this.defence = 25;
  }
}
console.log(Vampire);
