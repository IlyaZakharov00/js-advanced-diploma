/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
import Team from "./Team";

export function* characterGenerator(allowedTypes, maxLevel) {
  let randomType = Math.floor(Math.random() * allowedTypes.length);
  let randomLevel = Math.floor(Math.random() * maxLevel);
  yield new allowedTypes[randomType](randomLevel);
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const newTeam = new Team();
  let playerGenerator = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    let person = playerGenerator.next().value;
    newTeam.add(person);
  }
  return newTeam.toArray();
}
