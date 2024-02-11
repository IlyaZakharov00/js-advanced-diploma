import Character from "../Character";

export default class Magician extends Character {
  constructor(name, type = "Magician") {
    super(name, type);
    this.attack = 10;
    this.defence = 40;
  }
}
console.log(Magician);
