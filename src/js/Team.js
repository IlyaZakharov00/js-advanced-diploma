/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(person) {
    this.members.add(person);
  }

  addAll(...person) {
    person.forEach((item) => {
      this.members.add(item);
    });
  }

  toArray() {
    const arr = [];
    this.members.forEach((item) => arr.push(item));
    return arr;
  }
  delete(person) {
    console.log("Удален", person);
    this.members.delete(person);
  }
}

console.log(Team);
