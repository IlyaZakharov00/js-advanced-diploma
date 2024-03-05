import Bowerman from "../characters/Bowerman.js";
import Magician from "../characters/Magician.js";
import Vampire from "../characters/Vampire.js";
import { characterGenerator } from "../generators.js";

test("should create new random player", () => {
  const result = characterGenerator([Bowerman], 4);
  expect(result.next().value).toHaveProperty("type", "bowman");
});

test("should create new random player1", () => {
  const result = characterGenerator([Magician], 4);
  expect(result.next().value).toHaveProperty("type", "magician");
});

test("should create new random player2", () => {
  const result = characterGenerator([Vampire], 4);
  expect(result.next().value).toHaveProperty("type", "vampire");
});
