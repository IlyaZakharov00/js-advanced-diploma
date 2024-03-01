import Bowerman from "../characters/Bowerman.js";
import Magician from "../characters/Magician.js";
import Swordsman from "../characters/Swordsman.js";
import { generateTeam } from "../generators.js";

test("should create new random player", () => {
  const result = generateTeam([Bowerman, Magician, Swordsman], 5, 4);

  expect(result.length).toBe(4);
});
