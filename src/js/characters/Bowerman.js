import Character from "../Character";

export default class Bowerman extends Character {
  constructor(level, type = "bowman") {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
  }
}
console.log(Bowerman);
